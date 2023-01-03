import { Controller, UseGuards, Post, Body, Get, Param, Put, Delete, Query, Req, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

import { LoginDto } from '../../dtos/login.dto';
import { ResponseDto } from '../../dtos/response.dto';
import { Types } from 'mongoose'
import { Role } from '../../guards/roles.decorator';
import { CakeType } from '../../models/cakeType.model';

import { CakeTypeService } from './cakeType.service';

import { errors, messages } from '../../shared/responseCodes';

import { UserRoles } from '../../enums/userRoles.enum';
import { CakeTypeDto } from '../../dtos/cakeType.dto';
import { create } from 'domain';
import { Type } from 'class-transformer';

@ApiTags('CakeType')
@Controller('CakeType')
export class CakeTypeController {

    constructor(private service: CakeTypeService) { }
    /* POST CakeType End Point */


    // @Post('create')
    // @Role([UserRoles.baker])
    // async create(@Body() body: CakeTypeDto, @Req() req: any) {
    //     body.baker = new Types.ObjectId(req.user._id)
    //     const item = await this.service.create(body);
    //     return {
    //         success: item ? true : false,
    //         message: item ? messages.success.message : errors.notFound.message,
    //         code: item ? messages.success.code : errors.notFound.code,
    //         data: {
    //             item: item
    //         }
    //     }

    // }





    /* GET All  End Point */
    @ApiBearerAuth()
    @Get('/getAll')
    getAll(@Query('pagesize') pageSize: number, @Query('page') page: number,) {
        return this.service.findAll({}, page || 1, pageSize || 200);
    }



    
    /* End of CakeType Controller Class 
   */
}