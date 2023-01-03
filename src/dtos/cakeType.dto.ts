import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsString, Max, Min } from "class-validator";
import { BaseEntityDto } from "./baseEntity.dto";



export class CakeTypeDto extends BaseEntityDto {
    @ApiProperty({ required:true })
    @IsNotEmpty()
    name: string;

}