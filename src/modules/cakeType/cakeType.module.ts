import { Module } from '@nestjs/common';
import { CakeTypeService } from './cakeType.service';
import { CakeTypeController } from './cakeType.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CakeType, CakeTypeSchema } from '../../models/cakeType.model';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: CakeType.name,
        useFactory: async () => {
          const schema = CakeTypeSchema;
          return schema;
        },
      },
    ]),
  ],
  controllers: [CakeTypeController],
  providers: [CakeTypeService],
  exports: [CakeTypeService],
})
export class CakeTypeModule {}
