import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { jwtDefaultConfig } from 'src/configs/jwt.default.config';
import { JwtStarategy } from './strategy/jwt.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register(jwtDefaultConfig),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [AuthController],
  providers: [JwtStarategy, AuthService],
  exports: [JwtStarategy, PassportModule], // this module is export to other module
})
export class AuthModule {}
