import { Module } from '@nestjs/common';
import { BoardsController } from './boards.controller';
import { BoardsService } from './boards.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Board } from './entities/board.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Board]), AuthModule], // use Active Record
  controllers: [BoardsController],
  providers: [BoardsService],
})
export class BoardsModule {}
