import { Entity } from 'typeorm';
import { Comment } from './comment.entity';

@Entity() // it means 'create table'
export class InquiryComment extends Comment {}
