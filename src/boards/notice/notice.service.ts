import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { User } from 'src/auth/user.entity';
import { Notice } from '../entities/notice.entity';
import { CreateBoardDto } from '../dto/create-board.dto';
import { AwsService } from 'src/aws/aws.service';

@Injectable()
export class NoticeService {
  constructor(private awsService: AwsService) {}

  async getNoticeById(noticeId: number): Promise<Notice> {
    const noticeData = await Notice.findDataById(noticeId);
    if (noticeData == null || noticeData.available == false) {
      throw new NotFoundException();
    } else {
      return noticeData;
    }
  }

  async createNotice(
    file: Express.Multer.File,
    createBoardDto: CreateBoardDto,
    user: User,
  ): Promise<void> {
    if (user.isAdmin != true) {
      throw new UnauthorizedException(
        `you don't have authority to create Notice`,
      );
    }

    const now = new Date();
    const imageName = user.username + now.getTime();
    const ext = file.originalname.split('.').pop();

    const imageUrl = await this.awsService.imageUploadToS3(
      `${imageName}.${ext}`,
      file,
      ext,
    );

    await Notice.createNotice(createBoardDto, user, imageUrl);
  }

  async deleteNoticeById(noticeId: number, user: User): Promise<void> {
    const notice = await this.getNoticeById(noticeId);
    //없으면 자동으로 반환
    if (notice) {
      // 존재하는 글이어야 하고, 관리자이거나, 본인만 삭제
      if (notice.user == user || user.isAdmin == true) {
        notice.available = false;
        await notice.save();
      } else {
        throw new UnauthorizedException(
          `you don't have authority to delete Notice`,
        );
      }
    } else {
      throw new NotFoundException();
    }
  }

  async updateNoticeById(
    id: number,
    file: Express.Multer.File,
    updateBoardDto: CreateBoardDto,
    user: User,
  ): Promise<void> {
    const { title, description } = updateBoardDto;
    const notice = await this.getNoticeById(id);
    //없으면 자동으로 반환
    if (notice) {
      // 존재하는 글이어야 하고, 관리자이거나, 본인만 삭제

      if (notice.user == user || user.isAdmin == true) {
        notice.title = title;
        notice.description = description;
        await notice.save();
        if (file) {
          const now = new Date();
          const imageName = user.username + now.getTime();
          const ext = file.originalname.split('.').pop();

          const imageUrl = await this.awsService.imageUploadToS3(
            `${imageName}.${ext}`,
            file,
            ext,
          );
          notice.imageUrl = imageUrl;
          await notice.save();
        }
      } else {
        throw new UnauthorizedException(
          `you don't have authority to delete Notice`,
        );
      }
    } else {
      throw new NotFoundException();
    }
  }
}
