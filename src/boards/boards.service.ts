import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from 'src/auth/user.entity';
import { AwsService } from 'src/aws/aws.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { Board } from './entities/board.entity';
import 'dotenv/config';
import { MoreThanOrEqual } from 'typeorm';

@Injectable()
export abstract class BoardsService<T extends Board> {
  constructor(protected awsService: AwsService) {}

  abstract getEntityClass(): typeof Board;

  async getTotalPageCount(sortType: string, range: number): Promise<number> {
    const entityClass = this.getEntityClass();

    if (sortType == 'recent') {
      const entityData = await entityClass.findAndCount({
        where: { available: true },
      });
      return this.getTotalPageCountModule(entityData[1]);
    } else if (sortType == 'popularity') {
      const daysAgo = this.getDateOfDaysAgoModule(range);
      const entityData = await entityClass.findAndCount({
        where: { createdAt: MoreThanOrEqual(daysAgo), available: true },
      });
      return this.getTotalPageCountModule(entityData[1]);
    } else {
      throw new NotFoundException(`sort type is not supported.`);
    }
  }

  async getBoardsByPageNum(
    sortType: string,
    range: number,
    currentPage: number,
  ): Promise<Board[]> {
    const entityClass = this.getEntityClass();
    const totalPageCount = await this.getTotalPageCount(sortType, range);
    if (totalPageCount < currentPage) {
      throw new NotFoundException(`over maximum pageCount : ${totalPageCount}`);
    }
    if (sortType == 'recent') {
      const entityData = await entityClass.findAndCount({
        where: {
          available: true, // available이 true인 데이터만 가져옴
        },
        order: { createdAt: 'DESC' }, // 최신순으로 정렬
        skip: (currentPage - 1) * Number(process.env.BOARD_PER_PAGE), // offset만큼 건너뜀
        take: Number(process.env.BOARD_PER_PAGE), // limit만큼 가져옴
        select: ['title', 'createdAt', 'views'],
      });
      return entityData[0];
    } else if (sortType == 'popularity') {
      const daysAgo = this.getDateOfDaysAgoModule(range);
      const entityData = await entityClass.findAndCount({
        where: {
          available: true, // available이 true인 데이터만 가져옴
          createdAt: MoreThanOrEqual(daysAgo),
        },
        order: { views: 'DESC' }, // 최신순으로 정렬
        skip: (currentPage - 1) * Number(process.env.BOARD_PER_PAGE), // offset만큼 건너뜀
        take: Number(process.env.BOARD_PER_PAGE), // limit만큼 가져옴
        select: ['title', 'createdAt', 'views'],
      });
      return entityData[0];
    }
  }

  private getDateOfDaysAgoModule(range: number): Date {
    const now = new Date();
    const daysAgo = new Date();
    daysAgo.setDate(now.getDate() - range);
    return daysAgo;
  }

  private getTotalPageCountModule(entityData: number): number {
    const boardPerPage = Number(process.env.BOARD_PER_PAGE);
    const totalPageCount = Math.floor((entityData[1] - 1) / boardPerPage) + 1;
    return totalPageCount;
  }

  async getBoardByIdWithViewUp(id: number): Promise<Board> {
    const entity = await this.getBoardById(id);
    (entity as any).views = (entity as any).views + 1;
    await (entity as any).save();
    return entity;
  }

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
