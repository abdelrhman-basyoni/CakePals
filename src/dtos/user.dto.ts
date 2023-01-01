import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty,Min,Max,IsIn, IsEmail,IsInt, IsArray } from 'class-validator'
import { UserRoles } from "../enums/userRoles.enum";

export class DayTimeDto {
    @ApiProperty({ })
    @IsInt()
    @Min(0)
    @Max(23)
    hour:number;

    @ApiProperty({  })
    @IsInt()
    @Min(0)
    @Max(59)
    miutes:number;
}
export class CollectionTimeRangeDto {
    @ApiProperty({ type: () => DayTimeDto })
    @IsNotEmpty()
    start:DayTimeDto;

    @ApiProperty({ type: () => DayTimeDto })
    @IsNotEmpty()
    end:DayTimeDto;
}

export class BakerProfileDto {
    @ApiProperty({  })
    @IsNotEmpty()
    pic: string;

    @ApiProperty({  })
    @IsNotEmpty()
    about: string;

    // @ApiProperty({ default:5 })
    rating: number;

    // @ApiProperty({ default:1 })
    ratedOrders: number;

    // @ApiProperty({  })
    totalOrders: number;

    @ApiProperty({ type: () => [Number], example: [30.15645132, 30.4576541] })
    @IsArray()
    location:number[];

    @ApiProperty({ type: () => CollectionTimeRangeDto })
    @IsNotEmpty()
    collectionTimeRange:CollectionTimeRangeDto
}

export class UserDto{
    @ApiProperty({})
    @IsNotEmpty({})
    username: string;
  
    @ApiProperty({ })
    @IsEmail()
    email: string;
  

  

    role: UserRoles;
}

export class RegisterMemberDto extends UserDto {
    @ApiProperty({  })
    @IsNotEmpty({})
    password: string;
  
  

}

export class RegisterBakerDto extends RegisterMemberDto {
    @ApiProperty({ type:() => BakerProfileDto})
    @IsNotEmpty()
    profile: BakerProfileDto;
}

export class UpdateUserDto extends UserDto {
    @ApiProperty({ type:() => BakerProfileDto})
    profile: BakerProfileDto;
}