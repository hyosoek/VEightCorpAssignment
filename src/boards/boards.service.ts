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
import { Like, MoreThanOrEqual, FindOptions, FindOptionsWhere } from 'typeorm';

@Injectable()
export abstract class BoardsService<T extends Board> {
  constructor(protected awsService: AwsService) {}
  abstract getEntityClass(): typeof Board;
  entityClass = this.getEntityClass();

  async getBoardsByPageNum(
    sortType: string,
    range: number,
    currentPage: number,
  ): Promise<Board[]> {
    const totalPageCount = await this.getTotalPageCount(sortType, range);
    if (totalPageCount < currentPage) {
      throw new NotFoundException(`over maximum pageCount : ${totalPageCount}`);
    }
    if (sortType == 'recent') {
      const entityData = await this.entityClass.find({
        order: { createdAt: 'DESC' }, // 최신순으로 정렬
        skip: (currentPage - 1) * Number(process.env.BOARD_PER_PAGE), // offset만큼 건너뜀
        take: Number(process.env.BOARD_PER_PAGE), // limit만큼 가져옴
        select: ['id', 'title', 'createdAt', 'views'],
      });
      return entityData;
    } else if (sortType == 'popularity') {
      const daysAgo = this.getDateOfDaysAgoModule(range);
      const entityData = await this.entityClass.find({
        where: {
          createdAt: MoreThanOrEqual(daysAgo),
        },
        order: { views: 'DESC' }, // 최신순으로 정렬
        skip: (currentPage - 1) * Number(process.env.BOARD_PER_PAGE), // offset만큼 건너뜀
        take: Number(process.env.BOARD_PER_PAGE), // limit만큼 가져옴
        select: ['id', 'title', 'createdAt', 'views'],
      });
      return entityData;
    }
  }
  async getTotalPageCount(sortType: string, range: number): Promise<number> {
    if (sortType == 'recent') {
      const entityData = await this.entityClass.findAndCount();
      return this.getTotalPageCountModule(entityData[1]);
    } else if (sortType == 'popularity') {
      const daysAgo = this.getDateOfDaysAgoModule(range);
      const entityData = await this.entityClass.findAndCount({
        where: { createdAt: MoreThanOrEqual(daysAgo) },
      });
      return this.getTotalPageCountModule(entityData[1]);
    } else {
      throw new NotFoundException(`sort type is not supported.`);
    }
  }

  async getBoardsByKeyword(
    title: string,
    username: string,
    currentPage: number,
  ): Promise<Board[]> {
    const totalPageCount = await this.getSearchTotalPageCount(title, username);
    if (totalPageCount < currentPage) {
      throw new NotFoundException(`over maximum pageCount : ${totalPageCount}`);
    }
    let where: FindOptionsWhere<Board> = {};

    if (title) {
      where.title = Like(`%${title}%`);
    }
    if (username) {
      where.user = {
        username: Like(`%${username}%`),
      };
    }
    const entityData = await this.entityClass.find({
      where,
      order: { createdAt: 'DESC' }, // 최신순으로 정렬
      skip: (currentPage - 1) * Number(process.env.BOARD_PER_PAGE), // offset만큼 건너뜀
      take: Number(process.env.BOARD_PER_PAGE), // limit만큼 가져옴
      select: ['id', 'title', 'createdAt', 'views'],
    });
    return entityData;
  }

  async getSearchTotalPageCount(
    title: string,
    username: string,
  ): Promise<number> {
    let where: FindOptionsWhere<Board> = {};
    if (title) {
      where.title = Like(`%${title}%`);
    }
    if (username) {
      where.user = {
        username: Like(`%${username}%`),
      };
    }
    const entityData = await this.entityClass.findAndCount({
      where,
    });
    return this.getTotalPageCountModule(entityData[1]);
  }

  //private module
  private getDateOfDaysAgoModule(range: number): Date {
    const now = new Date();
    const daysAgo = new Date();
    daysAgo.setDate(now.getDate() - range);
    return daysAgo;
  }

  //private module
  private getTotalPageCountModule(entityData: number): number {
    const boardPerPage = Number(process.env.BOARD_PER_PAGE);
    const totalPageCount = Math.floor((entityData - 1) / boardPerPage) + 1;
    return totalPageCount;
  }

  async getBoardByIdWithViewUp(id: number, user: User): Promise<Board> {
    const entity = await this.getBoardById(id);
    (entity as any).views = (entity as any).views + 1;
    await (entity as any).save();
    return entity;
  }

  async getBoardById(id: number): Promise<Board> {
    const entityData = await this.entityClass.findDataById(id);
    if (entityData == null) {
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
    let imageUrl = null;
    if (file) {
      const now = new Date();
      const imageName = user.username + now.getTime();
      const ext = file.originalname.split('.').pop();

      imageUrl = await this.awsService.imageUploadToS3(
        `${imageName}.${ext}`,
        file,
        ext,
      );
    }
    await this.entityClass.createBoard(createBoardDto, user, imageUrl);
  }

  async deleteBoardById(id: number, user: User): Promise<void> {
    const entity = await this.getBoardById(id);
    if (entity) {
      if ((entity as any).user == user || user.isAdmin) {
        this.entityClass.softRemove(entity);
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

    if ((entity as any).user.id == user.id) {
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
  }
}
