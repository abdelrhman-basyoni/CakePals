import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ProjectionType, QueryOptions, UpdateQuery,FilterQuery,PipelineStage, AggregateOptions } from 'mongoose';

import { errors, messages } from './responseCodes';

@Injectable()
export abstract class AbstractService < modelDocument> {
    // private readonly log = new Logger(ProductService.name);
    constructor(
        public model: Model<any>,
        ) { }
        
    async create(body){
        const   res  = await this.model.create(body) ;
        return res
    }
    async createWithSession(body,session){
        const   res  = await this.model.create([body],{session}) ;
        return res
    }



    async findAll(filter:any,page:number, pageSize:number){

        const [total,items] =  await Promise.all([
            this.count(filter),
            this.findMany(filter,{},{skip:((page-1) *pageSize),limit:pageSize}) 

        ]);


        return {
            success: true,
            message: messages.success.message,
            code:messages.success.code,
            data:{
                total,
                items
            }
        }

    }

    /** basic services */
    async findByIdAndUpdate(id: string, update: UpdateQuery<modelDocument>, options?: QueryOptions<modelDocument>) {

        return await this.model.findByIdAndUpdate(id, update, { new: true, ...options })

    }
    async findOneAndUpdate(filter: FilterQuery<modelDocument>, update: UpdateQuery<modelDocument>, options?: QueryOptions<modelDocument>) {
        

        return await this.model.findOneAndUpdate(filter, update, {new: true, ...options})

    }

    async findOneById(id: string, projection?: ProjectionType<modelDocument>, options?: QueryOptions<modelDocument>) {
        return this.model.findById(id, projection, options);
    }

    async findOne(filter: any, projection?: ProjectionType<modelDocument>, options?: QueryOptions<modelDocument>) {
        return this.model.findOne(filter, projection, options);
    }

    async findMany(filter?: any, projection?: ProjectionType<modelDocument>, options?: QueryOptions<modelDocument>) {

        return this.model.find(filter, projection, options);
    }

    async findByIdAndDelete(id: string) {
        return await this.model.findByIdAndDelete(id);
    }
    async findOneAndDelete(filter: any) {
        return await this.model.findOneAndDelete(filter);
    }

    async remove(filter: any) {
        return await this.model.remove(filter);
    }
    async count(filter?: any) {
        return await this.model.count(filter);
    }

    async aggregate(pipeline: PipelineStage[],options?:AggregateOptions){
        return await this.model.aggregate(pipeline,options)
    }

}