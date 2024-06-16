import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Inquiry } from '../entities/inquiry.entity';
import { AwsService } from 'src/aws/aws.service';
import { BoardsService } from '../boards.service';
import { User } from 'src/auth/user.entity';
import { Board } from '../entities/board.entity';

@Injectable()
export class InquiryService extends BoardsService<Inquiry> {
  constructor(protected awsService: AwsService) {
    super(awsService);
  }

  getEntityClass() {
    return Inquiry;
  }

  async getBoardByIdWithViewUp(id: number, user: User): Promise<Board> {
    await this.checkAuthorization(id, user);
    return super.getBoardByIdWithViewUp(id, user);
  }

  private async checkAuthorization(id: number, user: User) {
    const options: any = { where: { id } };
    options.relations = ['user'];
    const inquiry = await Inquiry.findOne(options);
    if (user.isAdmin == false && user.id != inquiry.user.id) {
      // 작성한 사람이 1대1문의의 주인도 아니고, 관리자도 아닌 경우
      throw new UnauthorizedException(
        `you don't have authority to watch inquiry`,
      );
    }
  }
}
