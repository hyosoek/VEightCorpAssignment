import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthCredentialDto } from './dto/auth-credential.dto';
import { Account } from './account.entity';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async signIn(
    authCredentialDto: AuthCredentialDto,
  ): Promise<{ accessToken: string }> {
    const { username, password } = authCredentialDto;
    const user = await Account.findOne({ where: { username: username } });

    // if data exist and password right
    if (user && (await bcrypt.compare(password, user.password))) {
      const payload = { username }; // it can be read only. don't insert private data
      const accessToken = await this.jwtService.sign(payload);
      return { accessToken };
    } else {
      throw new UnauthorizedException('logIn failed');
    }
  }

  async signUp(authCredentialDto: AuthCredentialDto): Promise<void> {
    await Account.createUser(authCredentialDto);
  }

  async getAllUser(): Promise<Account[]> {
    return await Account.getAllUser();
  }
}
