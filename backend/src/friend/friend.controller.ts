import { Body, Controller, Request, Post, UseGuards, Get } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserService } from 'src/user/user.service';

@Controller('friend')
export class FriendController {
    constructor(private readonly userService: UserService){}

    @UseGuards (JwtAuthGuard)
    @Post('add')
    addFriend(@Request() req) {
        const user_id = req.user.id
        const friend_id = req.body.friend_id
        console.log(user_id, friend_id)
        return this.userService.addFriend(user_id, friend_id)
    }

    @UseGuards (JwtAuthGuard)
    @Post('remove')
    removeFriend(@Request() req) {
        const user_id = req.user.id
        const friend_id = req.body.friend_id
        console.log(user_id, friend_id)
        return this.userService.removeFriend(user_id, friend_id)
    }

    @UseGuards (JwtAuthGuard)
    @Get()
    getFriend(@Request() req) {
        return this.userService.findFriend(req.user.id)
    }

}
