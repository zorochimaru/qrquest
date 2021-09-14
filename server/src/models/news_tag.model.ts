import { Table, Model, Column, ForeignKey, DataType } from 'sequelize-typescript'
import { Tag } from './tag.model';
import { News } from './news.model';
import { Optional } from 'sequelize/types';
interface NewsTagAttributes {
  id: string
  newsId: string
  tagId: string
}
interface NewsTagCreationAttributes extends Optional<NewsTagAttributes, 'id'> { }
@Table({modelName:'news_tag'})
export default class NewsTags extends Model<NewsTagAttributes, NewsTagCreationAttributes>{
  @ForeignKey(() => News)
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
    primaryKey: true,
    unique: true,
  })
  id!: string
  @Column
  newsId!: number

  @ForeignKey(() => Tag)
  @Column
  tagId!: number
}
