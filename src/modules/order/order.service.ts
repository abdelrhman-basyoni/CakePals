import { BadRequestException, forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import { Order, OrderDocument } from "../../models/order.model";
import mongoose, { Model, Types } from "mongoose";
import { AbstractService } from "../../shared/abstract.service";
import { Cake } from "../../models/cake.model";
import { OrderStatus } from "../../enums/order.enum";
import { generateUniqueCode } from "../../shared/utils";
import { UserService } from "../user/user.service";
import { errors } from "../../shared/responseCodes";

@Injectable()
export class OrderService extends AbstractService<OrderDocument> {
    constructor(
        @InjectModel(Order.name) private OrderModel: Model<OrderDocument>,
        @InjectConnection() private readonly connection: mongoose.Connection,
        @Inject(forwardRef(() => UserService))
        private userService: UserService
    ) {
        super(OrderModel);
    }
    async create(body: Order): Promise<OrderDocument> {
        let code: number;
        let exist: any = {};

        while (exist) {
            code = generateUniqueCode()
            exist = await this.model.exists({ status: { $in: [OrderStatus.pending, OrderStatus.accepted] }, collectionCode: code })
        }
        body.collectionCode = code
        return await super.create(body);

    }

    async hotOrder(cake: Cake, memberId: string, collectionTime: number, bakingTime: number, firstAvailableTime: number) {
        /**
         * set the baking endTime to be at the collection time
         * and the bakingStartTime will be the end - the bakingTime
         */
        // console.log({ collectionTime, bakingTime })
        const order: Order = {
            cake,
            member: new Types.ObjectId(memberId),
            bakingEndTime: collectionTime,
            bakingStartTime: Number(collectionTime - bakingTime),
            collectionTime: collectionTime,
            status: OrderStatus.pending
        }

        if (order.bakingStartTime < firstAvailableTime) {
            throw new BadRequestException('cant deliver cake at this time')
        }
        const createdOrder = await this.create(order);

        if (!createdOrder) {
            throw new BadRequestException('invalid order')
        }
        return createdOrder
    }
    async notHotOrder(cake: Cake, memberId: string, collectionTime: number, bakingTime: number, firstAvailableTime: number) {
        /**
         * set the startTime at the the first availableTime and the end  + the bakingTime
         */

        const order: Order = {
            cake,
            member: new Types.ObjectId(memberId),

            bakingStartTime: firstAvailableTime,
            bakingEndTime: firstAvailableTime + bakingTime,

            collectionTime: collectionTime,
            status: OrderStatus.pending
        }

        const createdOrder = await this.create(order);

        if (!createdOrder) {
            throw new BadRequestException()
        }
        return createdOrder

    }

    async collectOrder(orderId: string, userId: string, collectionCode) {
        
        const session = await this.connection.startSession();
        let order, baker;
        await session.withTransaction(async () => {

            [order, baker] = await Promise.all([
                this.findOneAndUpdate({
                    _id: new Types.ObjectId(orderId),
                    'cake.baker': new Types.ObjectId(userId),
                    collectionCode: collectionCode,
                    status: OrderStatus.accepted
                }, {
                    status: OrderStatus.collected
                }, { session }),
                this.userService.findByIdAndUpdate(userId, { $inc: { 'profile.totalOrders': 1 } }, { session })

            ])
            
         
            if (!order || !baker) {
                throw new BadRequestException(errors.notFound);


            }


            
        });
        await session.endSession();

        return order;

    }


    async rateOrder(orderId: string, rate: number, userId: string) {
        const session = await this.connection.startSession();
        const cake = await this.findOneById(orderId);
        let order, baker;
        await session.withTransaction(async () => {
            [order, baker] = await Promise.all([
                this.userService.findOneAndUpdate({ _id: new Types.ObjectId(cake.cake.baker) }, { $inc: { 'profile.ratedOrders': 1, 'profile.rating': rate } }, { session }),
                this.findOneAndUpdate({
                    _id: new Types.ObjectId(orderId),
                    member: new Types.ObjectId(userId),

                }, { rate: rate }, { session })
            ])
            // console.log(order)
            if (!order || !baker) {
                throw new BadRequestException(errors.notFound);


            }


            return;
        });
        await session.endSession();

        return order;
    }

}
