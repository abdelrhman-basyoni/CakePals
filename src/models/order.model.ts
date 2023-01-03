import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { BaseEntity } from "./baseEntity.model";
import { User } from "./user.model";
import { Types } from "mongoose"
import { Cake } from "./cake.model";
export type OrderDocument = Order & Document;
@Schema({
    autoIndex: true,
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
    },
})
export class Order extends BaseEntity {

    @Prop({ type: Types.ObjectId, ref: User.name, required: true })
    member: Types.ObjectId;



    @Prop({type: () => Cake, required: true})
    cake:Cake;

    @Prop({})
    bakingStartTime: number;

    @Prop({})
    bakingEndTime: number;

    @Prop({})
    collectionTime: number;



}

export const OrderSchema = SchemaFactory.createForClass(Order);

OrderSchema.loadClass(Order);