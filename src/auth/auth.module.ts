import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { UserService } from 'src/user/user.service';
import { User, UserSchema } from 'src/user/schema/user.entity';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [UserModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        global: true,
        secret: configService.get<string>('SECRET_KEY'),
        signOptions: {
          expiresIn: configService.get<string>('SECRET_KEY_EXPIRED'),
        },
      }),
      inject: [ConfigService],
    }),
    PassportModule,

  ],
  controllers: [AuthController],
  providers: [AuthService, JwtService, UserService],
})
export class AuthModule { }
