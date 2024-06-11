import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Account } from './account.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { jwtConfig } from 'src/configs/jwt.config';
import { JwtStarategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register(jwtConfig),
    TypeOrmModule.forFeature([Account]),
  ],
  controllers: [AuthController],
  providers: [JwtStarategy, AuthService],
  exports: [JwtStarategy, PassportModule], // this module is export to other module
})
export class AuthModule {}
