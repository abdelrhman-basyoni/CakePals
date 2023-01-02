import { Cake, CakeDocument } from "../../models/cake.model";
import { Model, UpdateQuery, QueryOptions } from "mongoose";
import { AbstractService } from "../../shared/abstract.service";
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { messages } from "../../shared/responseCodes";
import { InjectModel } from "@nestjs/mongoose";
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class CakeService extends AbstractService<CakeDocument> {
    constructor(
        @InjectModel(Cake.name) private CakeModel: Model<CakeDocument>,
    ) {
        super(CakeModel);
    }

}