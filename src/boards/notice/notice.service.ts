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

    const { title, description } = createBoardDto;
    const notice = Notice.create({
      title,
      description,
      user,
      imageUrl,
    });
    await Notice.save(notice);
  }
}
