import { Tag } from './Tag.model';

export interface News {
    id: string;
    title: string;
    text: string;
    authorId: string;
    imgUrl: string | null;
    tags: Tag[]
}
