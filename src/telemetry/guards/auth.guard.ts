import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const token = this.configService.get<string>('INGEST_TOKEN');

    if (!token) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Authorization header missing');
    }

    const [type, providedToken] = authHeader.split(' ');

    if (type !== 'Bearer' || providedToken !== token) {
      throw new UnauthorizedException('Invalid token');
    }

    return true;
  }
}
