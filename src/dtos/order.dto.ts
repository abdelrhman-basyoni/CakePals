import { ApiProperty } from "@nestjs/swagger";
import { IsIn, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Types } from 'mongoose'
import { HotOrNot } from "../enums/order.enum";
import { CakeDto } from "./cake.dto";
export class CreateOrderDto {

    // @ApiProperty({ type: Types.ObjectId, required: true })
    // @IsString()
    member?: any;



    @ApiProperty({})
    @IsNotEmpty()
    cake:string;

    @ApiProperty({enum:[HotOrNot.hot,HotOrNot.not],examples:[HotOrNot.hot,HotOrNot.not] })
    @IsIn([HotOrNot.hot,HotOrNot.not])
    hotOrNot:string

    @ApiProperty({})
    @IsNotEmpty()
    @IsNumber()
    collectionTime: number;

}