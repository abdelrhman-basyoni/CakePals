import { Cake, CakeDocument } from "../../models/cake.model";
import { Model, UpdateQuery, QueryOptions } from "mongoose";
import { AbstractService } from "../../shared/abstract.service";
import { forwardRef, Inject, Injectable, UnauthorizedException } from '@nestjs/common';

import { messages } from "../../shared/responseCodes";
import { InjectModel } from "@nestjs/mongoose";
import { JwtService } from '@nestjs/jwt';
import { findCakesByRadiusAndType } from "./aggregation";
import { UserService } from "../user/user.service";
import { PipelineStage } from 'mongoose'
@Injectable()
export class CakeService extends AbstractService<CakeDocument> {
    constructor(
        @InjectModel(Cake.name) private CakeModel: Model<CakeDocument>,
        @Inject(forwardRef(() => UserService))
        private userService: UserService



    ) {
        super(CakeModel);
    }

    async filterCakes(location:[number,number],cakeType:string){
        const filterPipeline : PipelineStage []= findCakesByRadiusAndType(location,cakeType)
   
        const   test:any[] =   [
            {
                '$geoNear': {
                    'near': {
                        'type': 'Point',
                        'coordinates': [...location]
                    },
                    'distanceField': 'distance',
                    'maxDistance': 2000,
                    'spherical': true
                }
            }, {
                '$lookup': {
                    'from': 'cakes',
                    'let': {
                        'bakerId': '$_id'
                    },
                    'pipeline': [
                        {
                            '$match': {
                                '$expr': {
                                    '$and': [
                                        {
                                            '$eq': [
                                                '$baker', '$$bakerId'
                                            ]
                                        }, {
                                            '$eq': [
                                                '$cakeType', `${cakeType}`
                                            ]
                                        }
                                    ]
                                }
                            }
                        }
                    ],
                    'as': 'cakes'
                }
            }, {
                '$unwind': {
                    'path': '$cakes'
                }
            }, {
                '$group': {
                    '_id': null,
                    'cakes': {
                        '$push': '$cakes'
                    }
                }
            }
        ]

        const bakers = await this.userService.aggregate(filterPipeline)
       

        return bakers || [];
    }

}