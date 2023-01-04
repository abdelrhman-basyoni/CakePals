import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { TokenDto } from '../dtos/token.dto';
import { config } from './config';
import { TokenTypes } from '../enums/tokenTypes.enum';
export async function hashPassword(candidatePassword) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(candidatePassword, salt);
    return hashedPassword
}

export function removeKeys(keys: string[], object: any) {

    const clone = Object.create(object)
    keys.forEach(key => {
        delete clone[key];
    });
    return clone
}

export async function testSignToken(payload: TokenDto, tokenType: TokenTypes) {
    let secret;
    switch (tokenType) {
        case (TokenTypes.access): {
            secret = process.env.ACCESS_TOKEN_SECRET;
            break;
        }
        case (TokenTypes.refresh): {
            secret = process.env.REFRESH_TOKEN_SECRET;
            break;
        }
    }

    const jwtService = new JwtService()
    const token = await jwtService.signAsync(payload, {
        secret: secret,
        expiresIn: '1y'
    });
    return token;
}

/**
* Adds  times to a given date or create a new date.
* @param {number} hours - hours if no hours send 0.
* @param {number} minutes - miutes if no miutes send 0.
* @param {Date} givenDate - if u want to send a date object.
* @returns {Date} the given date or the created date plus the hours and minutes.
*/
export function addTime(hours: number, minutes: number, givenDate?: Date) {

    let date: Date;
    givenDate ? date = new Date(givenDate.getTime()) : date = new Date();
    date.setHours(date.getHours() + hours);
    date.setMinutes(date.getMinutes() + minutes);

    return date;

}

/**
* Adds  times to a given date or create a new date.
* @param {number} hours - hours if no hours send 0.
* @param {number} minutes - miutes if no miutes send 0.
* @returns {Date} date at 1970 1 jan + ur hours and miutes
*/
export function getRawTime(hours: number, minutes: number) {
    // let date = new Date(); // current date and time

     hours = hours * 60 * 60 * 1000; //  hours in milliseconds
     minutes = minutes * 60 * 1000; //  minutes in milliseconds

    // date.setTime(date.getTime() + hours + minutes);

    return Number(hours+minutes)
}