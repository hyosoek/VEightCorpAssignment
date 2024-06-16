import {
  Controller,
  Get,
  UseGuards,
  Post,
  UsePipes,
  Body,
  ValidationPipe,
  UseInterceptors,
  UploadedFile,
  Query,
  ParseIntPipe,
  Delete,
  Patch,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateBoardDto } from './dto/create-board.dto';

@UseGuards(AuthGuard())
export class BoardsController<T> {
  constructor(private readonly boardService: any) {}

  @Get('/sort') // for pagenation
  getBoardList(
    @Query('sortType') sortType: string,
    @Query('range', ParseIntPipe) range: string,
    @Query('currentPage', ParseIntPipe) currentPage: number,
  ) {
    return this.boardService.getBoardsByPageNum(sortType, range, currentPage);
  }

  @Get('/search')
  searchBoard(
    @Query('title') title: string,
    @Query('username') username: string,
    @Query('currentPage', ParseIntPipe) currentPage: number,
  ) {
    return this.boardService.getBoardsByKeyword(title, username, currentPage);
  }

  @Get('/sort/total-pagecount') // for pagenation
  async getBoardPageCount(
    @Query('sortType') sortType: string,
    @Query('range') range: string,
  ) {
    const totalPageCount = await this.boardService.getTotalPageCount(
      sortType,
      range,
    );
    return { totalPageCount: totalPageCount };
  }

  @Get('/search/total-pagecount') // for pagenation
  async getSearchPageCount(
    @Query('title') title: string,
    @Query('username') username: string,
  ) {
    const totalPageCount = await this.boardService.getSearchTotalPageCount(
      title,
      username,
    );
    return { totalSearchPageCount: totalPageCount };
  }

  @Get('/')
  getBoardById(@Query('id', ParseIntPipe) id: number) {
    return this.boardService.getBoardByIdWithViewUp(id);
  }

  @Post('/')
  @UseInterceptors(FileInterceptor('file'))
  @UsePipes(ValidationPipe)
  createBoard(
    @UploadedFile() file: Express.Multer.File,
    @Body() createBoardDto: CreateBoardDto,
    @GetUser() user: User,
  ): Promise<void> {
    return this.boardService.createBoard(file, createBoardDto, user);
  }

  @Delete('/')
  @UsePipes(ValidationPipe)
  deleteBoard(
    @Query('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<void> {
    return this.boardService.deleteBoardById(id, user);
  }

  @Patch('/')
  @UseInterceptors(FileInterceptor('file'))
  @UsePipes(ValidationPipe)
  updateBoard(
    @Query('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() updateBoardDto: any,
    @GetUser() user: User,
  ): Promise<void> {
    return this.boardService.updateBoardById(id, file, updateBoardDto, user);
  }
}
