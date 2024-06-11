// export interface Board {
//   id: string;
//   title: string;
//   description: string;
//   status: BoardStatus;
// }
// don't need, because We use Database Entity(duplicate role)

export enum BoardStatus {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
}
