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

  @OneToMany((type) => Board, (board) => board.account, { eager: true })
  boards: Board[];

  // why use static?
  // beacuse when every connection occur, we don't want to make each connection object.
  // so we use connection Function with static
  // and... It is just connect for DB(to transfer command)
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

  static async getAllUser(): Promise<Account[]> {
    return this.find();
  }
}
