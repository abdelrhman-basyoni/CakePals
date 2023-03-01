import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const role = this.reflector.get<string>('roles', context.getHandler()); //the role entered to the guard as an array
    const tokenRole = context.getArgs()[0].user.role; //this is the role inside the token

    if (context.getArgs().length > 0 && context.getArgs()[0].user) {
      if (role.includes(tokenRole)) {
        return true;
      }
    } else {
      return false;
    }
    return false;
  }
}
