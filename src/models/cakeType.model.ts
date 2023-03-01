import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseEntity } from './baseEntity.model';
export type CakeTypeDocument = CakeType & Document;
@Schema({
  autoIndex: true,
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
})
export class CakeType extends BaseEntity {
  @Prop({ required: true })
  name: string;
}

export const CakeTypeSchema = SchemaFactory.createForClass(CakeType);

CakeTypeSchema.loadClass(CakeType);
