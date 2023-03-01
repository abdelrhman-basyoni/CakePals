import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CakeType, CakeTypeDocument } from '../../models/cakeType.model';
import { Model } from 'mongoose';
import { AbstractService } from '../../shared/abstract.service';

@Injectable()
export class CakeTypeService extends AbstractService<CakeTypeDocument> {
  constructor(
    @InjectModel(CakeType.name) private CakeTypeModel: Model<CakeTypeDocument>,
  ) {
    super(CakeTypeModel);
  }
}
