import { Prop } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

export class GeoLocation {
  // @ApiProperty({ default: 'Point', required: true })
  @Prop({ default: 'Point', required: true })
  type: 'Point';
  // @ApiProperty({ type: () => [Number], example: [30.15645132, 30.4576541] })
  @Prop({ type: [Number], required: true })
  coordinates: number[];
}
