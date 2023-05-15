import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserService } from 'src/user/user.service';

@Controller('search')
export class SearchController {
    constructor(private readonly userService: UserService){}

    @UseGuards (JwtAuthGuard)
    @Get('/')
    null()  {
      return [];
    }

    @UseGuards (JwtAuthGuard)
    @Get(':input')
    search(@Param('input') params :any)  {
      // console.log(params, "dans controller")
      const user = this.userService.search(params);
      return user;
    }
}
