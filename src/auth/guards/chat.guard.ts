import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class ChatGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const client = context.switchToWs().getClient();
        const data = context.switchToWs().getData();
        const objectData = JSON.parse(data)
        const token = objectData?.auth;
        if (!token) return false;
        try {
            const payload =  this.jwtService.verify(token, {
                secret: process.env.SECRET_KEY,
            });
            client.data.user = payload;
        } catch (error) {
            throw new UnauthorizedException();
        }
        return true
    }
}
