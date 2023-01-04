import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Order, OrderDocument } from "../../models/order.model";
import { Model, Types } from "mongoose";
import { AbstractService } from "../../shared/abstract.service";
import { Cake } from "../../models/cake.model";
import { OrderStatus } from "../../enums/order.enum";

@Injectable()
export class OrderService extends AbstractService<OrderDocument> {
    constructor(
        @InjectModel(Order.name) private OrderModel: Model<OrderDocument>,
    ) {
        super(OrderModel);
    }

    async hotOrder(cake: Cake, memberId: string, collectionTime: number, bakingTime: number, firstAvailableTime: number) {
        /**
         * set the baking endTime to be at the collection time
         *  and the bakingStartTime will be the end - the bakingTime
         */
        console.log({ collectionTime, bakingTime })
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

}
