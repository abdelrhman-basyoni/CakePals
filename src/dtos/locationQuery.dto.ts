import { Transform, Type } from 'class-transformer';
import { IsArray, IsString } from 'class-validator';

export class locationQuery {
  @IsArray()
  // @IsString({ each: true })
  @Type(() => Number)
  @Transform(({ value }) => value.split(','))
  locations?: [number, number];

  // ...
}
