import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ExtractJwt } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { Reflector } from '@nestjs/core';
import { Role } from '../roles.enum';
import { ROLES_KEY } from '../roles.decorator';
import { ItemsService } from '../../items/items.service';

@Injectable()
export class RolesGuard implements CanActivate {
  private extract = ExtractJwt.fromAuthHeaderAsBearerToken();
  constructor(
    private itemsService: ItemsService,
    private authService: AuthService,
    private reflector: Reflector,
  ) {}

  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }

  private isAuthorized = (requiredRoles: Role[], userRoles: Role[]) =>
    requiredRoles.some((role) => (userRoles ?? []).includes(role));

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const req = this.getRequest(context);
    const token = await this.extract(req);
    const user = await this.authService.decodeToken(token);
    if (!user || !this.isAuthorized(requiredRoles, user.roles)) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
