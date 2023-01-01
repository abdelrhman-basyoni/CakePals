
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';
import { UserRoles } from '../enums/userRoles.enum';
import { BaseEntity } from './baseEntity.model';
import * as bcrypt from 'bcrypt';
import { GeoLocation } from './geoLocation';
export type UserDocument = User & Document;
export class DayTime {
    @Prop({ min:0, max:23 })
    hour:number;
    @Prop({ min:0, max:59 })
    miutes:number;
}


export class CollectionTimeRange{
    @Prop({ type: () => DayTime })
    start:DayTime;

    @Prop({ type: () => DayTime })
    end:DayTime;
}

export class Profile {
    @Prop({ unique: true })
    pic: string;

    @Prop({  })
    about: string;

    @Prop({ default:5 })
    rating: number;

    @Prop({ default:1 })
    ratedOrders: number;

    @Prop({  })
    totalOrders: number;

    @Prop({ type: () => GeoLocation })
    location:GeoLocation;

    @Prop({ type: () => CollectionTimeRange })
    collectionTimeRange:CollectionTimeRange

}






@Schema({
    autoIndex: true,
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
  })
  export class User extends BaseEntity {
    @Prop({ unique: false })
    username: string;
  
    @Prop({ unique: true })
    email: string;
  
  
    @Prop({ select: false })
    password: string;
  
  
    @Prop({ type : () => Profile})
    profile?: Profile;
  
  
    @Prop({
      enum: UserRoles,
      type: String,
      default: UserRoles.member
    })
    role: UserRoles;
  
  
  
    async checkPassword(candidatePassword: string) {
      return bcrypt.compare(candidatePassword, this.password);
    };
  }
export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.loadClass(User);