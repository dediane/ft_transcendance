import { Get, Injectable, Logger, Request, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);
  constructor(private configService: ConfigService) { }

  getHello(): string {
    this.logger.log(this.configService.get('APP_NAME'));
    return 'Hello World!';
  }
}
