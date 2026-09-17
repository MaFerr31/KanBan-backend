import { Body, Controller, HttpCode, HttpStatus, Post, Get, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register-user')
    async register(@Body() dto: RegisterDto){
        return this.authService.register(dto);
    }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    async login(@Body() dto: LoginDto) {
        return this.authService.login(dto);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('me')
    getProfile(@Request() req: any) {
        return req.user;
    }
}
