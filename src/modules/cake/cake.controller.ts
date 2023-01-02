import { Controller, UseGuards, Post, Body, Get, Param, Put, Delete, Query, Req, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

import { LoginDto } from '../../dtos/login.dto';
import { ResponseDto } from '../../dtos/response.dto';
import { Types } from 'mongoose'
import { Role } from '../../guards/roles.decorator';
import { Cake } from '../../models/cake.model';

import { CakeService } from './cake.service';

import { errors, messages } from '../../shared/responseCodes';

import { UserRoles } from '../../enums/userRoles.enum';
import { CakeDto } from '../../dtos/cake.dto';
import { create } from 'domain';
import { Type } from 'class-transformer';

@ApiTags('Cake')
@Controller('Cake')
export class CakeController {

    constructor(private service: CakeService) { }
    /* POST Cake End Point */


    @Post('create')
    @Role([UserRoles.baker])
    async create(@Body() body: CakeDto, @Req() req: any) {
        body.baker = new Types.ObjectId(req.user._id)
        const item = await this.service.create(body);
        return {
            success: item ? true : false,
            message: item ? messages.success.message : errors.notFound.message,
            code: item ? messages.success.code : errors.notFound.code,
            data: {
                item: item
            }
        }

    }





    /* GET All  End Point */
    @ApiBearerAuth()
    @Get('/getAll')
    getAll(@Query('pagesize') pageSize: number, @Query('page') page: number,) {
        return this.service.findAll({}, page || 1, pageSize || 20);
    }



    /* GET One Cake End Point */
    @ApiBearerAuth()
    @Get('/findOne/:id')
    async findOne(@Param('id') id: string): Promise<ResponseDto> {
        const cake = await this.service.findOneById(id);
        if(!cake){
            throw new NotFoundException('resource not found')
        }

        return {
            success:   true ,
            message:  messages.success.message ,
            code:  messages.success.code ,
            data: {
                item: cake
            }
        };
    }



    /* PUT  Cake End Point */
    @ApiBearerAuth()
    @Role([UserRoles.baker])
    @Put('/updateOne:id')
    async updateOne(@Param('id') id: string, @Body() body: CakeDto, @Req() req: any) {
        /** 
         * the one that can change it for now should be the cake owner
        */
        const bakerId = new Types.ObjectId(req.user._id)
        const cake = await this.service.findOneAndUpdate({
            _id: new Types.ObjectId(id),
            baker: bakerId
        }, body);

        if(!cake){
            throw new NotFoundException('resource not found')
        }
        return {
            success:   true ,
            message:  messages.success.message ,
            code:  messages.success.code ,
            data: {
                item: cake
            }
        };
    }



    /* Delete  Cake End Point */
    @ApiBearerAuth()
    // @UseGuards(JwtAuthGuard)
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
        if(!cake){
            throw new NotFoundException('resource not found')
        }
        return {
            success:   true ,
            message:  messages.success.message ,
            code:  messages.success.code ,
            data: {
                item: cake
            }
        };
    }
    /* End of Cake Controller Class 
   */
}