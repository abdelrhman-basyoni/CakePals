import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Order, OrderDocument } from "../../models/order.model";
import { Model } from "mongoose";
import { AbstractService } from "../../shared/abstract.service";

@Injectable()
export class OrderService extends AbstractService<OrderDocument> {
    constructor(
        @InjectModel(Order.name) private OrderModel: Model<OrderDocument>,
    ) {
        super(OrderModel);
    }

}
