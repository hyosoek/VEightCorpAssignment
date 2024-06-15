//Active Record Pattern
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { AuthCredentialDto } from './dto/auth-credential.dto';
import {
  ConflictException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { Board } from 'src/boards/entities/board.entity';

@Entity()
@Unique(['username'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column({ length: 500 })
  password: string;

  @Column({ nullable: true, length: 500 })
  currentHashedRefreshToken: string;

  @Column({ default: false })
  isAdmin: boolean;

  @OneToMany((type) => Board, (board) => board.user, { eager: true })
  boards: Board[];

  static async createUser(authCredentialDto: AuthCredentialDto): Promise<void> {
    const { username, password } = authCredentialDto;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = this.create({ username: username, password: hashedPassword });
    // Create method don't connect to DB. just make code object.
    try {
      await this.save(user);
    } catch (error) {
      if (error.code == 'ER_DUP_ENTRY') {
        throw new ConflictException('Existing username');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  static async setCurrentRefreshToken(
    refreshToken: string,
    userId: number,
  ): Promise<void> {
    try {
      const currentHashedRefreshToken = refreshToken;
      await this.update(userId, {
        currentHashedRefreshToken,
      });
    } catch (error) {
      if (error.code == '23505') {
        throw new ConflictException('Non Exist Username');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  static async getCurrentHashedRefreshToken(userId: number): Promise<User> {
    const user = await User.findOne({
      where: { id: userId },
      select: ['id', 'currentHashedRefreshToken'],
    });
    return user;
  }

  static async getUserDataFromSignin(
    username: string,
    password: string,
  ): Promise<User> {
    const user = await User.findOne({
      where: { username: username },
      select: ['id', 'username', 'isAdmin', 'password'],
    });
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    } else {
      throw new UnauthorizedException('signin failed');
    }
  }
}
