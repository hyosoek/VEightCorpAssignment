import { Entity } from 'typeorm';
import { Board } from './board.entity';

@Entity() // it means 'create table'
export class Inquiry extends Board {}
