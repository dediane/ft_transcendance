import { Body, Controller, Request, Post, UseGuards, Get } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserService } from 'src/user/user.service';

@Controller('friend')
export class FriendController {
    constructor(private readonly userService: UserService){}

    @UseGuards (JwtAuthGuard)
    @Post('add')
    async addFriend(@Request() req) {
        const user_id = req.user.id
        const friend_id = req.body.friend_id
        // console.log(user_id, friend_id)
        try {
            return await this.userService.addFriend(user_id, friend_id)
        } catch(err) {
            // console.log(err)
            return {status: false, message: "Friend already added"}
        }
    }

    @UseGuards (JwtAuthGuard)
    @Post('accept')
    accept(@Request() req) {
        const user_id = req.user.id
        const friend_id = req.body.friend_id
        // console.log(user_id, friend_id)
        return this.userService.addFriend(user_id, friend_id)
    }

    @UseGuards (JwtAuthGuard)
    @Post('remove')
    removeFriend(@Request() req) {
        const user_id = req.user.id
        const friend_id = req.body.friend_id
        // console.log(user_id, friend_id)
        return this.userService.removeFriend(user_id, friend_id)
    }

    @UseGuards (JwtAuthGuard)
    @Get()
    getFriend(@Request() req) {
        return this.userService.findFriend(req.user.id)
    }

    @UseGuards(JwtAuthGuard)
    @Post('sendrequest')
    async sendFriendRequest(@Request() req) {
    const user_id = req.user.id;
    const friend_id = req.body.friend_id;
    const response = await this.userService.sendFriendRequest(user_id, friend_id);
    return response;
    }

    @UseGuards(JwtAuthGuard)
    @Post('acceptrequest')
    async acceptFriendRequest(@Request() req) {
    const friendRequestId = req.body.friendRequestId;
    const response = await this.userService.acceptFriendRequest(friendRequestId);
    return response;
    }

    @UseGuards(JwtAuthGuard)
    @Post('rejectrequest')
    async rejectFriendRequest(@Request() req) {
    const friendRequestId = req.body.friendRequestId;
    const response = await this.userService.rejectFriendRequest(friendRequestId);
    return response;
    }
}
