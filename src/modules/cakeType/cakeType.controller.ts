import {
  Controller,
  UseGuards,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
  Query,
  Req,
  NotFoundException,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

import { LoginDto } from '../../dtos/login.dto';
import { ResponseDto } from '../../dtos/response.dto';
import { Types } from 'mongoose';
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
  constructor(private service: CakeTypeService) {}
  /* POST CakeType End Point */

  /* GET All  End Point */

  @ApiBearerAuth()
  @Role([UserRoles.member, UserRoles.baker, UserRoles.guest])
  @Get('/getAll')
  getAll(@Query('pagesize') pageSize: number, @Query('page') page: number) {
    return this.service.findAll({}, page || 1, pageSize || 200);
  }

  /* End of CakeType Controller Class
   */
}
