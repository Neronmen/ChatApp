import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { loginAuthDto } from './dto/login-auth.dto';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';

const EXPIRE_TIME = 86400 * 1000;

@Injectable()
export class AuthService {
  constructor(
    protected readonly userService: UserService,
    protected readonly jwtService: JwtService,
  ) { }
  async login(loginAuthDto: loginAuthDto) {
    const { email, password } = loginAuthDto;
    const user = await this.validateUser(loginAuthDto);
    if (!user) {
      throw new BadRequestException(`Email hoặc mật khẩu không đúng`)
    }
    const payload = { sub: user._id, username: user.email };
    return {
      user,
      backendTokens: {
        accessToken: await this.jwtService.signAsync(payload, {
          expiresIn: '1d',
          secret: process.env.SECRET_KEY,
        }),
        refreshToken: await this.jwtService.signAsync(payload, {
          expiresIn: '7d',
          secret: process.env.SECRET_KEY_REFRESH,
        }),
        expiresIn: new Date().setTime(new Date().getTime() + EXPIRE_TIME),
      }
    }
  }

  async refreshToken(user: any) {
    const payload = { sub: user.sub, username: user.username };
    return {
      accessToken: await this.jwtService.signAsync(payload, {
        expiresIn: '1d',
        secret: process.env.SECRET_KEY,
      }),
      refreshToken: await this.jwtService.signAsync(payload, {
        expiresIn: '7d',
        secret: process.env.SECRET_KEY_REFRESH,
      }),
      expiresIn: new Date().setTime(new Date().getTime() + EXPIRE_TIME),
    };

  }


  async validateUser(dto: loginAuthDto) {
    const user = await this.userService.findByEmail(dto.email);
    if (user && (await compare(dto.password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    throw new BadRequestException(`Tài khoản hoặc mật khẩu không đúng`);
  }

}
