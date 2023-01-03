import { Controller, UseGuards, Post, Body, Get, Param, Put, Delete, Query, Req, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

import { LoginDto } from '../../dtos/login.dto';
import { ResponseDto } from '../../dtos/response.dto';
import { Types } from 'mongoose'
import { Role } from '../../guards/roles.decorator';
import { Order } from '../../models/order.model';

import { OrderService } from './order.service';

import { errors, messages } from '../../shared/responseCodes';

import { UserRoles } from '../../enums/userRoles.enum';
// import { OrderDto } from '../../dtos/order.dto';
import { create } from 'domain';
import { Type } from 'class-transformer';

@ApiTags('Order')
@Controller('Order')
export class OrderController {

    constructor(private service: OrderService) { }




    /* GET All  End Point */
    @ApiBearerAuth()
    @Get('/getAll')
    getAll(@Query('pagesize') pageSize: number, @Query('page') page: number,) {
        return this.service.findAll({}, page || 1, pageSize || 200);
    }



    
    /* End of Order Controller Class 
   */
}