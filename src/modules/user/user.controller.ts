import { Controller, UseGuards, Post, Body, Get, Param, Put, Delete, Query, Req, Res, HttpStatus, HttpCode } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Types } from 'mongoose'
import { LoginDto } from '../../dtos/login.dto';
import { ResponseDto } from '../../dtos/response.dto';
import { RegisterBakerDto, RegisterMemberDto, UpdateUserDto, UserDto } from '../../dtos/user.dto'
import { Role } from '../../guards/roles.decorator';
import { User } from '../../models/user.model';
import { UserService } from './user.service';
import { BadRequestException } from '@nestjs/common';
import { errors, messages } from '../../shared/responseCodes';
import { UserRoles } from '../../enums/userRoles.enum';
import { GeoLocation } from '../../models/shared'
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
@ApiTags('User')
@Controller('User')
export class UserController {

    constructor(
        private service: UserService,
        private authService : AuthService
        ) { }
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
                item: serviceRes
            }

        }



    }
    @Post('/register-baker')
    async bakerRegister(@Body() body: RegisterBakerDto): Promise<ResponseDto> {

        /** validate if the the collection time range bigger than the start + 6 hours
         * c
         */
        if (body.profile.collectionTimeRange.end.hour < (body.profile.collectionTimeRange.start.hour + 6)) {
            throw new BadRequestException('invalid request')
        }
        body.role = UserRoles.baker
        const location = {
            type: "Point",
            coordinates: body.profile.location
        }

        const res = await this.service.create({ ...body, profile: { ...body.profile, location: location } })
        return {
            success: true,
            message: messages.success.message,
            code: messages.success.code,
            data: {
                item: res
            }

        }

    }
    @Post('/login')
    async logiIn(@Body() body: LoginDto): Promise<ResponseDto> {

        return this.authService.login(body)

    }
    @Role([UserRoles.baker, UserRoles.member])
    @Get('/logOut')
    @ApiBearerAuth()
    async logOut(@Req() req: any): Promise<ResponseDto> {

        const loggout = await this.authService.logout(req.user._id)

        return {
            success: true,
            message: messages.success.message,
            code: messages.success.code,
        }

    }

    @UseGuards(AuthGuard('refreshStrategy'))
    @ApiBearerAuth()
    @Get('refreshToken')
    async refresToken(@Req() req: any) {

        const token = req.headers['authorization'].split(" ")[1]
        const accessToken = await this.authService.refreshToken(token)
        
        return {
            success: true,
            message: messages.success.message,
            code: messages.success.code,
            data:{
                accessToken
            }
        }
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
        const user = await this.service.findOneById(id);
        if (!user) {
            throw new BadRequestException(errors.notFound)
        }
        return {
            success: true,
            message: messages.success.message,
            code: messages.success.code,
            data: {
                item: user
            }
        }
    }

    @Get('/bakerProfile/:id')
    async findBakerProfile(@Param('id') id: string): Promise<ResponseDto> {
        const user = await this.service.findOne({
            _id: new Types.ObjectId(id),
            role: UserRoles.baker
        }, {
            username: 1,
            profile: 1
        });
        if (!user) {
            throw new BadRequestException(errors.notFound, 'invalid')
        }
        return {
            success: true,
            message: messages.success.message,
            code: messages.success.code,
            data: {
                item: user
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
                item: user
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
                item: user
            }
        }
    }


    @Get('/getAvailableCollectingTimes/:id')
    async getAvailabilities(@Param('id') bakerId: string, @Query('cake') cakeId: string) {

        const times = await this.service.getAvailableCollectingTimes(bakerId, cakeId)


        return {
            success: true,
            message: messages.success.message,
            code: messages.success.code,
            data: {
                items: times
            }
        }

    }
    /* End of User Controller Class 
   */
}   