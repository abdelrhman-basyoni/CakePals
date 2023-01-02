


import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Document } from 'mongoose';
import { BaseEntity } from './baseEntity.model';
import { DayTime } from './shared';
export type CakeDocument = Cake & Document;



@Schema({
    autoIndex: true,
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
  })
  export class Cake extends BaseEntity {
    @Prop({ required:true })
    title: string;
  
    @Prop({ required:true })
    description: string;
  
  
    @Prop({ required:true })
    price: number;
  
  
    @Prop({ type: () => DayTime })
    bakingTime:DayTime;


    @Prop({required:true})
    type:string
  

  
  
  

  }
export const CakeSchema = SchemaFactory.createForClass(Cake);

CakeSchema.loadClass(Cake);

