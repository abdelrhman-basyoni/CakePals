import { Controller, UseGuards, Post, Body, Get, Param, Put, Delete, Query, Req, Res, HttpStatus, HttpCode } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

import { LoginDto } from '../../dtos/login.dto';
import { ResponseDto } from '../../dtos/response.dto';
import { RegisterBakerDto, RegisterMemberDto, UpdateUserDto, UserDto } from '../../dtos/user.dto'
import { Role } from '../../guards/roles.decorator';
import { User } from '../../models/user.model';
import { UsePipes, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { BadRequestException } from '@nestjs/common';
import { errors, messages } from '../../shared/responseCodes';
import { UserRoles } from '../../enums/userRoles.enum';

@ApiTags('User')
@Controller('User')
export class UserController {

    constructor(private service: UserService) { }
    /* POST User End Point */


    @Post('/register-member')
    // @HttpCode(HttpStatus.CREATED)
    async signUp(@Body() body: RegisterMemberDto): Promise<ResponseDto> {
      
        body.role = UserRoles.member
        
        const serviceRes = await this.service.create(body)
        return {
            success: true,
            message: messages.success.message,
            code: messages.success.code,
            data: {
                user: serviceRes
            }

        }



    }
    @Post('/register-baker')
    async bakerRegister(@Body() body: RegisterBakerDto): Promise<ResponseDto> {
   
        /** validate if the the collection time range bigger than the start + 6 hours */
        if (body.profile.collectionTimeRange.end.hour < (body.profile.collectionTimeRange.start.hour + 6)) {
            throw new BadRequestException('invalid request')
        }
        body.role = UserRoles.baker

        const res = await this.service.create(body)
        return {
            success: true,
            message: messages.success.message,
            code: messages.success.code,
            data: {
                user: res
            }

        }

    }
    @Post('/login')
    async logiIn(@Body() body: LoginDto): Promise<ResponseDto> {

        return this.service.login(body)

    }




    /* GET All  End Point */
    @ApiBearerAuth()
    @Get('/getAll')
    getAll(@Query('pagesize') pageSize: number, @Query('page') page: number,) {
        return this.service.findAll({}, page || 1, pageSize || 20);
    }



    /* GET One User End Point */
    @ApiBearerAuth()
    @Get('/findOne/:id')
    async findOne(@Param('id') id: string): Promise<ResponseDto> {
        const user = await this.service.findOne(id);
        return {
            success: user ? true : false,
            message: user ? messages.success.message : errors.notFound.message,
            code: user ? messages.success.code : errors.notFound.code,
            data: {
                user: user
            }
        }
    }



    /* PUT  User End Point */
    @ApiBearerAuth()

    @Put('/updateOne:id')
    async updateOne(@Param('id') id: string, @Body() req: UpdateUserDto) {
        /** allow only the profile field if the user is baker */
        switch (req.role) {
            case UserRoles.baker: {
                break;
            }
            default: {
                req.profile = undefined;
            }
        }
        const user = await this.service.findByIdAndUpdate(id, req);
        return {
            success: user ? true : false,
            message: user ? messages.success.message : errors.notFound.message,
            code: user ? messages.success.code : errors.notFound.code,
            data: {
                user: user
            }
        }
    }



    /* Delete  User End Point */
    @ApiBearerAuth()
    // @UseGuards(JwtAuthGuard)
    @Role([UserRoles.admin])
    @Delete('/deleteOne/:id')
    async deleteOne(@Param('id') id: string) {
        const user = await this.service.findByIdAndDelete(id)
        return {
            success: user ? true : false,
            message: user ? messages.success.message : errors.notFound.message,
            code: user ? messages.success.code : errors.notFound.code,
            data: {
                user: user
            }
        }
    }
    /* End of User Controller Class 
   */
}