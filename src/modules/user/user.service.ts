import { User, UserDocument } from "../../models/user.model";
import { Model, UpdateQuery, QueryOptions, Types } from "mongoose";
import { AbstractService } from "../../shared/abstract.service";
import { Injectable, UnauthorizedException,BadRequestException,Inject } from '@nestjs/common';
import { LoginDto } from "../../dtos/login.dto";
import { TokenDto } from "../../dtos/token.dto";
import { errors, messages } from "../../shared/responseCodes";
import { InjectModel } from "@nestjs/mongoose";
import { JwtService } from '@nestjs/jwt';
import { config } from "../../shared/config";
import { addTime, getRawTime, hashPassword } from "../../shared/utils";
import { UserRoles } from "../../enums/userRoles.enum";
import { CakeService } from "../cake/cake.service";
import { OrderService } from "../order/order.service";
import { OrderStatus } from "../../enums/order.enum";
import { Period } from "../../dtos/user.dto";
import { Order } from "../../models/order.model";
import { RedisService } from "../cashe/redis.service";
@Injectable()
export class UserService extends AbstractService<UserDocument> {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        private jwtService: JwtService,
        private cakeService: CakeService,
        private orderService: OrderService,
        @Inject(RedisService) private  redisService: RedisService
    ) {
        super(userModel);
    }
    async create(req) {
        /**to follow the open closed princeple OCP */
        req.password = await hashPassword(req.password)
        const res = await super.create(req);
        res.password = undefined;
        return res

    }


    async getAvailableCollectingTimes(bakerId: string, cakeId: string) {
        /**
         * calculate intial time is it now + baking time or is it toadys first time for the baker 
         */
        // //console.log({ bakerId, cakeId });
        const baker = await this.findOne({ _id: new Types.ObjectId(bakerId), role: UserRoles.baker });
        const cake = await this.cakeService.findOneById(cakeId);

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const bakerTimeRange = baker.profile.collectionTimeRange;
        //console.log(bakerTimeRange.start, bakerTimeRange.end)
        let bakerFirstCollectingTime = Number(addTime(bakerTimeRange.start.hours, bakerTimeRange.start.miutes, today));
        let bakerLastCollectingTime = Number(addTime(bakerTimeRange.end.hours, bakerTimeRange.end.miutes, today));

        const nowPlusBaking = Number(addTime(cake.bakingTime.hours, cake.bakingTime.miutes));
        //console.log({bakerFirstCollectingTime,bakerLastCollectingTime})
        let startTime: number;
        if (Number(nowPlusBaking) >= Number(bakerFirstCollectingTime)) {
            startTime = Number(nowPlusBaking)
        } else {
            startTime = Number(bakerFirstCollectingTime)
        }
        //console.log({ startTime, nowPlusBaking })
        /**
         * get all orders that is accepted and its endTime is greater than startTime
         * get it sorted based on its bakingStartTime ascending 
         */

        const orders = await this.orderService.findMany({
            'cake.baker': new Types.ObjectId(bakerId),
            status: OrderStatus.accepted,
            bakingEndTime: { $gte: startTime }

        }, {}, { sort: { bakingStartTime: 1 } });

        //console.log({ orders })

        const bakingTime = getRawTime(cake.bakingTime.hours, cake.bakingTime.miutes)

        /** get the available collectionTimes */
        const availableTimes = getFreePeriods(orders,startTime,bakerLastCollectingTime,bakingTime)

        /** if periods from the functions this means this baker has no orders yet
         * then add from now or the start 
         */
        if (availableTimes.length == 0) {
            const period = {
                start: startTime + config.waitingTimeforPendingOrders,
                end: bakerLastCollectingTime
            }
            availableTimes.push(period)
        }
        //console.log({availableTimes})
        return availableTimes;

    }



}


/**
 * a function tofind all availableTimes and
 * @returns {availableTimes : Period[]} array of periods or an empty array
 */
function getFreePeriods(orders: Order[], startTime: number, bakerLastCollectingTime: number, bakingTime: number) {
    const lastIndex = orders.length - 1;
    const availableTimes: Period[] = [];
    orders.forEach((order, index) => {
        const nextOrder = orders[index+1]
        const period: Period = {
            start: 0,
            end: 0
        };

        if (index === 0) {
            /** if its the first element check it against the startTime */
            if (order.bakingStartTime <= startTime) {
                period.start = order.bakingEndTime;
            } else {
                period.start = startTime;
                period.end = order.bakingStartTime
            }

        } else if (index === lastIndex) {
            /** time betweeen last order and baker  last collection time */
            period.start = order.bakingEndTime;
            period.end = bakerLastCollectingTime
        }
        else {
            period.start = order.bakingEndTime;
            period.end = nextOrder.bakingStartTime
        }

        /** calculate check if period is bigger than baking time of cake 
         * if bigger subtract baking time of cake and add the new period
         * add the pending time to the start
         */
        const periodDiff = period.end - period.start;

        if (periodDiff > bakingTime) {
            period.start = period.start + bakingTime + config.waitingTimeforPendingOrders;
            availableTimes.push(period)
        }


    })

    return availableTimes;
}