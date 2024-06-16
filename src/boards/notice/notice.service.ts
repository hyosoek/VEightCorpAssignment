import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Notice } from '../entities/notice.entity';
import { AwsService } from 'src/aws/aws.service';
import { BoardsService } from '../boards.service';
import { CreateBoardDto } from '../dto/create-board.dto';
import { User } from 'src/auth/user.entity';

@Injectable()
export class NoticeService extends BoardsService<Notice> {
  constructor(protected awsService: AwsService) {
    super(awsService);
  }

  getEntityClass() {
    return Notice;
  }

  async createBoard(
    file: Express.Multer.File,
    createBoardDto: CreateBoardDto,
    user: User,
  ): Promise<void> {
    await this.checkAuthorization(user);
    return super.createBoard(file, createBoardDto, user);
  }

  private async checkAuthorization(user: User) {
    if (user.isAdmin == false) {
      throw new UnauthorizedException('only admin can post notice');
    }
  }
}
