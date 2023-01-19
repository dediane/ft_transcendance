import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';

@Controller('profile')
export class ProfileController {
  @Get()
  findAll(@Req() request: Request): object {
    return ({name:"toto", lastname: "Le Blagueur"});
  }
}
