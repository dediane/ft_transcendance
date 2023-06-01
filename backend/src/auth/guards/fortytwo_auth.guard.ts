import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class FortyTwoAuthGuard extends AuthGuard('42') {
  handleRequest(err: any, user: any, info: any, context: any, status?: any) {
    const request = context.switchToHttp().getRequest();

    if (request.query.error) {
      // Redirect to login page if error exists in query params
      return request.res.redirect('http://localhost:3000/login');
    }
    if (!user)
        return
    return super.handleRequest(err, user, info, context, status);
  }
}