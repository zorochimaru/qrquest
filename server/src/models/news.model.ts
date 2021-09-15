import { Table, Model, Column, DataType, ForeignKey, BelongsTo, BelongsToMany, HasMany } from 'sequelize-typescript'

import { Optional } from 'sequelize/types';
import { Tag } from './tag.model';
import { User } from './user.model';
import NewsTags from './news_tag.model';
interface NewsAttributes {
    id: string,
    title: string,
    text: string,
    authorId: string,
    imgUrl: string | null,
}
interface NewsCreationAttributes extends Optional<NewsAttributes, 'id'> { }

@Table
export class News extends Model<NewsAttributes, NewsCreationAttributes>{
    @BelongsToMany(() => Tag, () => NewsTags)
    tags!: Tag[]

    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        allowNull: false,
        primaryKey: true,
        unique: true,
    })
    id!: string

    @Column({
        type: DataType.STRING(50),
        allowNull: true
    })
    title!: string

    @Column({
        type: DataType.TEXT,
        allowNull: true
    })
    text!: string

    @Column({
        type: DataType.TEXT,
        allowNull: true
    })
    imgUrl!: string

    @ForeignKey(() => User)
    @Column({
        allowNull: false
    })
    authorId!: string

}
