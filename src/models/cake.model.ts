import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Document, Types } from 'mongoose';
import { BaseEntity } from './baseEntity.model';
import { DayTime } from './shared';
import { User } from './user.model';
export type CakeDocument = Cake & Document;

@Schema({
  autoIndex: true,
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
})
export class Cake extends BaseEntity {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  price: number;

  @Prop({ type: () => DayTime })
  bakingTime: DayTime;

  @Prop({ required: true })
  cakeType: string;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  baker: Types.ObjectId;
}
export const CakeSchema = SchemaFactory.createForClass(Cake);

CakeSchema.loadClass(Cake);
