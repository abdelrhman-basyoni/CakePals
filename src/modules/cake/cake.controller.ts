import { Controller, UseGuards, Post, Body, Get, Param, Put, Delete, Query, Req, NotFoundException, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

import { LoginDto } from '../../dtos/login.dto';
import { ResponseDto } from '../../dtos/response.dto';
import { Types } from 'mongoose'
import { Role } from '../../guards/roles.decorator';
import { Cake } from '../../models/cake.model';

import { CakeService } from './cake.service';

import { errors, messages } from '../../shared/responseCodes';

import { UserRoles } from '../../enums/userRoles.enum';
import { CakeDto } from '../../dtos/cake.dto';

import { CakeTypeService } from '../cakeType/cakeType.service';
import mongoose from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';
import { locationQuery } from '../../dtos/locationQuery.dto';
// const connection = new mongoose.Connection()
@ApiTags('Cake')
@Controller('Cake')
export class CakeController {

    constructor(
        private service: CakeService,
        private cakeTypeService: CakeTypeService,
        @InjectConnection()private  readonly connection: mongoose.Connection

    ) { }
    /* POST Cake End Point */


    @ApiBearerAuth()
    @Post('create')
    @Role([UserRoles.baker])
    async create(@Body() body: CakeDto, @Req() req: any) {
        /**
         * check if the cake exist or not if existes create new one 
         * 
         */

        body.baker = new Types.ObjectId(req.user._id)
        const session = await this.connection.startSession();
        let cakeType, item;
       
        await session.withTransaction(async () => {
            [cakeType, item] = await Promise.all([
                this.cakeTypeService.findOneAndUpdate({ name: body.cakeType }, { name: body.cakeType }, { upsert: true, session }),
                this.service.createWithSession(body,session)
            ])

            if (!cakeType || !item[0]) {
                throw new BadRequestException('');


            }


            return;
        });
        await session.endSession();
  
        return {
            success:  true ,
            message: messages.success.message ,
            code: messages.success.code ,
            data: {
                item: item[0]
            }
        }

    }





    /* GET All  End Point */
    
    @ApiBearerAuth()
    @Role([UserRoles.member, UserRoles.baker, UserRoles.guest])
    @Get('/getAll')
    getAll(@Query('pagesize') pageSize: number, @Query('page') page: number,) {
        return this.service.findAll({}, page || 1, pageSize || 20);
    }


    
    @ApiBearerAuth()
    @Role([UserRoles.member, UserRoles.baker, UserRoles.guest])
    @ApiQuery({name: 'location',example:'[30.15645132, 30.4576541]'})
    @Get('/filterCake')
    async filterCakes(
    @Query('location') location:string,@Query('caketype') cakeType: string) {
        const formatedLocation :[number,number] = JSON.parse(location);

        
        if(!cakeType || !location){
            throw new BadRequestException()
        }
        if( !Array.isArray(formatedLocation) || formatedLocation.length != 2){
            throw new BadRequestException('invalid location format')
        }
 
        const cakes =  await this.service.filterCakes(formatedLocation,cakeType);
        return {
            success: true,
            message: messages.success.message,
            code: messages.success.code,
            data: {
                items: cakes
            }
        }
    }



    /* GET One Cake End Point */
    
    @ApiBearerAuth()
    @Role([UserRoles.member, UserRoles.baker, UserRoles.guest])
    @Get('/findOne/:id')
    async findOne(@Param('id') id: string): Promise<ResponseDto> {
        const cake = await this.service.findOneById(id);
        if (!cake) {
            throw new NotFoundException('resource not found')
        }

        return {
            success: true,
            message: messages.success.message,
            code: messages.success.code,
            data: {
                item: cake
            }
        };
    }



    /* PUT  Cake End Point */
    @ApiBearerAuth()
    @Role([UserRoles.baker])
    @Put('/updateOne/:id')
    async updateOne(@Param('id') id: string, @Body() body: CakeDto, @Req() req: any) {
        /** 
         * the one that can change it for now should be the cake owner
        */
        const bakerId = new Types.ObjectId(req.user._id)
        const session = await this.connection.startSession();
        let cake, item;

        await session.withTransaction(async () => {
            [cake, item] = await Promise.all([
                this.cakeTypeService.findOneAndUpdate({ name: body.cakeType }, { name: body.cakeType }, { upsert: true, session }),
                this.service.findOneAndUpdate({
                    _id: new Types.ObjectId(id),
                    baker: bakerId
                }, body,{session})
            ])

            if (!cake || !item[0]) {
                throw new BadRequestException();


            }


            return;
        });
        await session.endSession();
    

        if (!cake) {
            throw new NotFoundException('resource not found')
        }
        return {
            success: true,
            message: messages.success.message,
            code: messages.success.code,
            data: {
                item: cake
            }
        };
    }



    /* Delete  Cake End Point */
    @ApiBearerAuth()
    @Role([UserRoles.baker])
    @Delete('/deleteOne/:id')
    async deleteOne(@Param('id') id: string, @Req() req: any) {
        /** 
       * the one that can change it for now should be the cake owner
      */
        const bakerId = new Types.ObjectId(req.user._id)
        const cake = await this.service.findOneAndDelete({
            _id: new Types.ObjectId(id),
            baker: bakerId
        })
        if (!cake) {
            throw new NotFoundException('resource not found')
        }
        return {
            success: true,
            message: messages.success.message,
            code: messages.success.code,
            data: {
                item: cake
            }
        };
    }
    /* End of Cake Controller Class 
   */
}