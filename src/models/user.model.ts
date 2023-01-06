
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';
import { UserRoles } from '../enums/userRoles.enum';
import { BaseEntity } from './baseEntity.model';
import * as bcrypt from 'bcrypt';
import { GeoLocation, DayTime } from './shared';
export type UserDocument = User & Document;



export class CollectionTimeRange {
  @Prop({ type: () => DayTime })
  start: DayTime;

  @Prop({ type: () => DayTime })
  end: DayTime;
}

export class Profile {
  @Prop({ unique: true })
  pic: string;

  @Prop({})
  about: string;

  @Prop({ default: 5})
  rating: number;

  @Prop({ default: 1, })
  ratedOrders: number;

  @Prop({ default: 0,  })
  totalOrders: number;

  @Prop({ type: () => GeoLocation })
  location: GeoLocation;

  @Prop({ type: () => CollectionTimeRange })
  collectionTimeRange: CollectionTimeRange

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


  @Prop({ type: () => Profile })
  profile?: Profile;


  @Prop({
    enum: UserRoles,
    type: String,
    default: UserRoles.member
  })
  role: UserRoles;

  @Prop({ unique: true })
  refreshToken: string;

  async checkPassword(candidatePassword: string) {
    return bcrypt.compare(candidatePassword, this.password);
  };
}
export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ 'profile.location': '2dsphere' });
UserSchema.loadClass(User);