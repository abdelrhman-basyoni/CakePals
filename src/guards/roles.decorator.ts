import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { UserRoles } from '../enums/userRoles.enum';
import { JwtAuthGuard } from './jwt.guard';
import { RolesGuard } from './roles.guard';

export function Role(role: UserRoles[]) {
  return applyDecorators(
    UseGuards(JwtAuthGuard),
    SetMetadata('roles', role),
    UseGuards(RolesGuard),
  );
}
// applyDecorators();
