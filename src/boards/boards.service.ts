import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from 'src/auth/user.entity';
import { AwsService } from 'src/aws/aws.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { Board } from './entities/board.entity';

@Injectable()
export abstract class BoardsService<T extends Board> {
  constructor(protected awsService: AwsService) {}

  abstract getEntityClass(): typeof Board;

  async getBoardById(id: number): Promise<Board> {
    const entityClass = this.getEntityClass();
    const entityData = await entityClass.findDataById(id);
    if (entityData == null || (entityData as any).available == false) {
      throw new NotFoundException();
    } else {
      return entityData;
    }
  }

  async createBoard(
    file: Express.Multer.File,
    createBoardDto: CreateBoardDto,
    user: User,
  ): Promise<void> {
    if (!user.isAdmin) {
      throw new UnauthorizedException(
        `you don't have authority to create entity`,
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

    const entityClass = this.getEntityClass();
    await entityClass.createNotice(createBoardDto, user, imageUrl);
  }

  async deleteBoardById(id: number, user: User): Promise<void> {
    const entity = await this.getBoardById(id);
    if (entity) {
      if ((entity as any).user == user || user.isAdmin) {
        (entity as any).available = false;
        await (entity as any).save();
      } else {
        throw new UnauthorizedException(
          `you don't have authority to delete entity`,
        );
      }
    } else {
      throw new NotFoundException();
    }
  }

  async updateBoardById(
    id: number,
    file: Express.Multer.File,
    updateBoardDto: CreateBoardDto,
    user: User,
  ): Promise<void> {
    const { title, description } = updateBoardDto;
    const entity = await this.getBoardById(id);
    if (entity) {
      if ((entity as any).user == user || user.isAdmin) {
        (entity as any).title = title;
        (entity as any).description = description;
        await (entity as any).save();
        if (file) {
          const now = new Date();
          const imageName = user.username + now.getTime();
          const ext = file.originalname.split('.').pop();

          const imageUrl = await this.awsService.imageUploadToS3(
            `${imageName}.${ext}`,
            file,
            ext,
          );
          (entity as any).imageUrl = imageUrl;
          await (entity as any).save();
        }
      } else {
        throw new UnauthorizedException(
          `you don't have authority to update entity`,
        );
      }
    } else {
      throw new NotFoundException();
    }
  }
}
