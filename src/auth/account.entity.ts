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
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { Board } from 'src/boards/board.entity';

@Entity()
@Unique(['username'])
export class Account extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  currentHashedRefreshToken: string;

  @OneToMany((type) => Board, (board) => board.account, { eager: true })
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
      if (error.code == '23505') {
        throw new ConflictException('Existing username');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  static async setCurrentRefreshToken(refreshToken: string, userId: number) {
    const salt = await bcrypt.genSalt();
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, salt);
    await this.update(userId, {
      currentHashedRefreshToken,
    });
  }
}
