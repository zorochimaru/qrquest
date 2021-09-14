import { Table, Model, Column, DataType, BelongsToMany } from 'sequelize-typescript'

import { Optional } from 'sequelize/types';
import { News } from './news.model';
import  NewsTags  from './news_tag.model';

interface TagAttributes {
    id: number,
    value: string,
}
interface TagCreationAttributes extends Optional<TagAttributes, 'id'> { }

@Table
export class Tag extends Model<TagAttributes, TagCreationAttributes>{
    @BelongsToMany(() => News, () => NewsTags)
    news!: News[]
    @Column({
        type: DataType.DOUBLE,
        allowNull: false,
        primaryKey: true,
        unique: true,
        autoIncrement: true
    })
    id!: number

    @Column({
        type: DataType.STRING(100),
        allowNull: false
    })
    value!: string

}
