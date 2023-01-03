import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Types } from 'mongoose'
import { CakeDto } from "./cake.dto";
export class CreateOrderDto {

    @ApiProperty({ type: Types.ObjectId, required: true })
    @IsString()
    member: any;



    @ApiProperty({type: () => CakeDto, required: true})
    @IsNotEmpty()
    cake:CakeDto;

    @ApiProperty({})
    @IsNotEmpty()
    @IsNumber()
    bakingStartTime: number;

    @ApiProperty({})
    @IsNotEmpty()
    @IsNumber()
    bakingEndTime: number;

    @ApiProperty({})
    @IsNotEmpty()
    @IsNumber()
    collectionTime: number;

}