import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { loginAuthDto } from './dto/login-auth.dto';
import { RefreshGuard } from './guards/refresh.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  create(@Body() loginAuthDto: loginAuthDto) {
    return this.authService.login(loginAuthDto);
  }

  @UseGuards(RefreshGuard)
  @Post('refresh')
  refresh(@Request() req) {
    return this.authService.refreshToken(req.user);
  }

}
