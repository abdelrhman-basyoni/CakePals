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
  Res,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { LoginDto } from '../../dtos/login.dto';
import { ResponseDto } from '../../dtos/response.dto';
import {
  GuestUserDto,
  RegisterBakerDto,
  RegisterMemberDto,
  ToggleAcceptingOrdersDto,
  UpdateUserDto,
  UserDto,
} from '../../dtos/user.dto';
import { Role } from '../../guards/roles.decorator';
import { User } from '../../models/user.model';
import { UserService } from './user.service';
import { BadRequestException } from '@nestjs/common';
import { errors, messages } from '../../shared/responseCodes';
import { UserRoles } from '../../enums/userRoles.enum';
import { GeoLocation } from '../../models/shared';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { checkPasswordStrength } from '../../shared/utils';
import { appSettings } from '../../shared/app.settings';
import { CakeService } from '../cake/cake.service';

@ApiTags('User')
@Controller('User')
export class UserController {
  constructor(
    private service: UserService,
    private cakeService: CakeService,
    private authService: AuthService,
  ) {}
  /* POST User End Point */

  @Post('/register-member')
  // @HttpCode(HttpStatus.CREATED)
  async signUp(@Body() body: RegisterMemberDto): Promise<ResponseDto> {
    body.role = UserRoles.member;
    const checked = checkPasswordStrength(body.password);
    const serviceRes = await this.service.create(body);
    return {
      success: true,
      message: messages.success.message,
      code: messages.success.code,
      data: {
        item: serviceRes,
      },
    };
  }

  @Post('/register-baker')
  async bakerRegister(@Body() body: RegisterBakerDto): Promise<ResponseDto> {
    /** validate if the the collection time range bigger than the start + 6 hours
     * c
     */
    if (
      body.profile.collectionTimeRange.end.hour <
      body.profile.collectionTimeRange.start.hour + appSettings.minWorkingHours
    ) {
      throw new BadRequestException(errors.invalidRequest);
    }
    checkPasswordStrength(body.password);
    body.role = UserRoles.baker;
    const location = {
      type: 'Point',
      coordinates: body.profile.location,
    };

    const res = await this.service.create({
      ...body,
      profile: { ...body.profile, location: location },
    });
    return {
      success: true,
      message: messages.success.message,
      code: messages.success.code,
      data: {
        item: res,
      },
    };
  }

  @Post('/login')
  async logiIn(@Body() body: LoginDto): Promise<ResponseDto> {
    return this.authService.login(body);
  }
  @Role([UserRoles.baker, UserRoles.member])
  @Get('/logOut')
  @ApiBearerAuth()
  async logOut(@Req() req: any): Promise<ResponseDto> {
    const loggout = await this.authService.logout(req.user._id);

    return {
      success: true,
      message: messages.success.message,
      code: messages.success.code,
    };
  }

  @UseGuards(AuthGuard('refreshStrategy'))
  @ApiBearerAuth()
  @Get('refreshToken')
  async refresToken(@Req() req: any) {
    const token = req.headers['authorization'].split(' ')[1];
    const accessToken = await this.authService.refreshToken(token);

    return {
      success: true,
      message: messages.success.message,
      code: messages.success.code,
      data: {
        accessToken,
      },
    };
  }

  @Post('guesttoken')
  async guestToken(@Body() body: GuestUserDto) {
    const token = await this.authService.guestToken(body.address);

    return {
      success: true,
      message: messages.success.message,
      code: messages.success.code,
      data: {
        accessToken: token,
      },
    };
  }

  /* GET All  End Point */
  @ApiBearerAuth()
  @Role([UserRoles.member, UserRoles.baker, UserRoles.guest])
  @Get('/getAll')
  getAll(@Query('pagesize') pageSize: number, @Query('page') page: number) {
    return this.service.findAll({}, page || 1, pageSize || 20);
  }

  /* GET One User End Point */
  @ApiBearerAuth()
  @Role([UserRoles.member, UserRoles.baker, UserRoles.guest])
  @Get('/findOne/:id')
  async findOne(@Param('id') id: string): Promise<ResponseDto> {
    const user = await this.service.findOneById(id);
    if (!user) {
      throw new BadRequestException(errors.notFound);
    }
    return {
      success: true,
      message: messages.success.message,
      code: messages.success.code,
      data: {
        item: user,
      },
    };
  }

  @ApiBearerAuth()
  @Role([UserRoles.member, UserRoles.baker, UserRoles.guest])
  @Get('/bakerProfile/:id')
  async findBakerProfile(@Param('id') id: string): Promise<ResponseDto> {
    const user = await this.service.findOne(
      {
        _id: new Types.ObjectId(id),
        role: UserRoles.baker,
      },
      {
        username: 1,
        profile: 1,
      },
    );
    if (!user) {
      throw new BadRequestException(errors.notFound, 'invalid');
    }
    return {
      success: true,
      message: messages.success.message,
      code: messages.success.code,
      data: {
        item: user,
      },
    };
  }

  /* PUT  User End Point */
  @ApiBearerAuth()
  @Role([UserRoles.member, UserRoles.baker])
  @Put('/updateOne')
  async updateOne(@Body() body: UpdateUserDto, @Req() req: any) {
    /** allow only the profile field if the user is baker */
    const requestUser = req.user;
    switch (requestUser.role) {
      /** insure that no leake in user profile */
      case UserRoles.baker: {
        break;
      }
      default: {
        body.profile = undefined;
      }
    }
    const user = await this.service.findByIdAndUpdate(requestUser._id, body);
    if (!user) {
      throw new BadRequestException(errors.invalidRequest);
    }
    return {
      success: true,
      message: messages.success.message,
      code: messages.success.code,
      data: {
        item: user,
      },
    };
  }

  @ApiBearerAuth()
  @Role([UserRoles.baker])
  @Put('/updateOne')
  async toggleAcceptingOrders(
    @Body() body: ToggleAcceptingOrdersDto,
    @Req() req: any,
  ) {
    /** allow only the profile field if the user is baker */

    const user = await this.service.findByIdAndUpdate(req.user._id, {
      'profile.IsAcceptingOrders': body.IsAcceptingOrders,
    });
    if (!user) {
      throw new BadRequestException(errors.notFound);
    }
    return {
      success: true,
      message: messages.success.message,
      code: messages.success.code,
      data: {
        item: user,
      },
    };
  }

  /* Delete  User End Point */
  @ApiBearerAuth()
  @Role([UserRoles.admin])
  @Delete('/deleteOne/:id')
  async deleteOne(@Param('id') id: string) {
    const user = await this.service.findByIdAndDelete(id);
    return {
      success: user ? true : false,
      message: user ? messages.success.message : errors.notFound.message,
      code: user ? messages.success.code : errors.notFound.code,
      data: {
        item: user,
      },
    };
  }

  @ApiBearerAuth()
  @Role([UserRoles.member, UserRoles.baker, UserRoles.guest])
  @Get('/getAvailableCollectingTimes/:id')
  async getAvailabilities(
    @Param('id') bakerId: string,
    @Query('cake') cakeId: string,
  ) {
    const cake = await this.cakeService.findOneById(cakeId);
    const baker = await this.service.findOne({
      _id: new Types.ObjectId(String(cake.baker)),
      role: UserRoles.baker,
      'profile.IsAcceptingOrders': true,
    });
    if (!baker || !cake) {
      throw new BadRequestException(errors.invalidRequest);
    }
    if (!baker.profile.IsAcceptingOrders) {
      throw new BadRequestException(errors.bakerNotAcceptingOrders);
    }

    const times = await this.service.getAvailableCollectingTimes(baker, cake);

    return {
      success: true,
      message: messages.success.message,
      code: messages.success.code,
      data: {
        items: times,
      },
    };
  }
  /* End of User Controller Class
   */
}
