import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';
import { BaseEntityDto } from './baseEntity.dto';
import { DayTimeDto } from './user.dto';
export class cakeTimeDto extends DayTimeDto {
  @ApiProperty({})
  @IsInt()
  @Min(0)
  @Max(4)
  hours: number;

  @ApiProperty({})
  @IsInt()
  @Min(0)
  @Max(59)
  miutes: number;
}

export class CakeDto extends BaseEntityDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  title: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  description: string;

  @ApiProperty({ required: true })
  @IsInt()
  @Min(0)
  price: number;

  @ApiProperty({ type: () => cakeTimeDto })
  @IsNotEmpty()
  bakingTime: cakeTimeDto;

  @ApiProperty({ required: true, example: 'honeyPie' })
  @IsNotEmpty()
  @IsString()
  cakeType: string;

  baker?: any;
}
