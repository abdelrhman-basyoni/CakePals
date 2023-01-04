import { Controller, UseGuards, Post, Body, Get, Param, Put, Delete, Query, Req, NotFoundException, BadRequestException } from '@nestjs/common';
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
import { CreateOrderDto } from '../../dtos/order.dto';
import { UserService } from '../user/user.service';
import { CakeService } from '../cake/cake.service';
import { addTime, getRawTime } from '../../shared/utils';
import { HotOrNot } from '../../enums/order.enum';
import { config } from '../../shared/config';

@ApiTags('Order')
@Controller('Order')
export class OrderController {

    constructor(
        private service: OrderService,
        private userService: UserService,
        private cakeService: CakeService
    ) { }

    @Role([UserRoles.member])
    @Post('/create')
    async create(@Body() body: CreateOrderDto, @Req() req: any) {
        /**
         * validate if the collectionTime isActuallyValid;
         */
        const cake = await this.cakeService.findOneById(body.cake)
        const periods = await this.userService.getAvailableCollectingTimes(String(cake.baker), body.cake)
        let isValidCollectionTime = false;
        for (const period of periods) {
            if (body.collectionTime < period.end) {
                isValidCollectionTime = true;
                break;
            }
        }
        if (!isValidCollectionTime) {
            throw new BadRequestException('invalid time')
        }

        const bakingTime = getRawTime(cake.bakingTime.hours, cake.bakingTime.miutes)
        const firstAvailableTime = Number(addTime(0, Number(config.waitingTimeforPendingOrders), new Date(periods[0].start)))
        let order: Order;
        switch (body.hotOrNot) {
            case (HotOrNot.hot): {
                order = await this.service.hotOrder(
                    cake,
                    req.user._id,
                    body.collectionTime,
                    bakingTime,
                    firstAvailableTime
                )
                break;
            }
            case (HotOrNot.not): {
                order = await this.service.notHotOrder(
                    cake,
                    req.user._id,
                    body.collectionTime,
                    bakingTime,
                    firstAvailableTime

                )
                break;
            }
        }

        return {
            success: true,
            message: messages.success.message,
            code: messages.success.code,
            data: {
                items: order
            }
        }
    }

    /* GET All  End Point */
    @ApiBearerAuth()
    @Get('/getAll')
    getAll(@Query('pagesize') pageSize: number, @Query('page') page: number,) {
        return this.service.findAll({}, page || 1, pageSize || 200);
    }




    /* End of Order Controller Class 
   */
}