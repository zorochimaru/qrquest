import { Answer } from './answer.model';

export interface Question {
  id: string;
  text: string;
  questId: string;
  answers: Answer[];
  imgUrl?: string;
}
