import { Table, Model, Column, DataType, BelongsToMany, ForeignKey } from 'sequelize-typescript'

import { Optional } from 'sequelize/types';
import { News } from './news.model';
import NewsTags from './news_tag.model';

interface TagAttributes {
    id: string,
    value: string,
}
interface TagCreationAttributes extends Optional<TagAttributes, 'id'> { }

@Table
export class Tag extends Model<TagAttributes, TagCreationAttributes>{
    @BelongsToMany(() => News, () => NewsTags)
    news!: News[] & { news_tag: NewsTags }
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        allowNull: false,
        primaryKey: true,
        unique: true,
    })
    id!: string

    @Column({
        type: DataType.STRING(100),
        allowNull: false
    })
    value!: string

}
