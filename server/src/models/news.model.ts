import { Table, Model, Column, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript'

import { Optional } from 'sequelize/types';
import User from './user.model';

interface NewsAttributes {
    id: string,
    title: string,
    text: string,
    authorId: string,
    link?: string,
    imgUrl?: string,
}
interface NewsCreationAttributes extends Optional<NewsAttributes, 'id'> { }

@Table
class News extends Model<NewsAttributes, NewsCreationAttributes>{
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
        type: DataType.STRING(50),
    })
    link!: string

    @Column({
        type: DataType.TEXT,
    })
    imgUrl!: string

    @ForeignKey(() => User)
    @Column({
        allowNull: false
    })
    authorId!: string

}
export default News;