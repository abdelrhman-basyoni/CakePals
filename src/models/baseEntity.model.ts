import { Prop } from "@nestjs/mongoose";


export class BaseEntity  {
    _id?: any;
  
    @Prop({})

    createdAt?: number;

    @Prop({})

    updatedAt?: number;
  }
  