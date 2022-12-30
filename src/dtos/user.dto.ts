import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty,Min,Max,IsIn, IsEmail,IsInt } from 'class-validator'
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
    start:DayTimeDto;

    @ApiProperty({ type: () => DayTimeDto })
    end:DayTimeDto;
}

export class BakerProfileDto {
    @ApiProperty({  })
    pic: string;

    @ApiProperty({  })
    about: string;

    @ApiProperty({ default:5 })
    rating: number;

    @ApiProperty({ default:1 })
    ratedOrders: number;

    @ApiProperty({  })
    totalOrders: number;

    @ApiProperty({ type: () => [Number], example: [30.15645132, 30.4576541] })
    location:number[];

    @ApiProperty({ type: () => CollectionTimeRangeDto })
    collectionTimeRange:CollectionTimeRangeDto
}


export class RegisterMemberDto{
    @ApiProperty({})
    @IsNotEmpty({})
    userName: string;
  
    @ApiProperty({ })
    @IsEmail()
    email: string;
  
  
    @ApiProperty({  })
    @IsNotEmpty({})
    password: string;
  

  

    role: UserRoles;
  
  

}

export class RegisterBakerDto extends RegisterMemberDto {
    @ApiProperty({ type:() => BakerProfileDto})
    profile: BakerProfileDto;
}