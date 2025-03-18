import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { loginAuthDto } from './dto/login-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  create(@Body() loginAuthDto: loginAuthDto) {
    return this.authService.login(loginAuthDto);
  }

}
