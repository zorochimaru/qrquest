import { Table, Model, Column, DataType, HasMany } from 'sequelize-typescript'

import { Optional } from 'sequelize/types';
import { Question } from './question.model';
interface QuestAttributes {
  id: string,
  name: string,
  description: string,
  date: Date,
  imgUrl: string | null,
}
interface QuestCreationAttributes extends Optional<QuestAttributes, 'id'> { }

@Table
export class Quest extends Model<QuestAttributes, QuestCreationAttributes>{
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
    primaryKey: true,
    unique: true,
  })
  id: string

  @Column({
    type: DataType.STRING(50),
    allowNull: false
  })
  name: string

  @Column({
    allowNull: true
  })
  description: string

  @Column({
    allowNull: true
  })
  imgUrl: string

  @Column({
    type: DataType.DATE,
    allowNull: false
  })
  date: Date

  @HasMany(() => Question, {
    onDelete: 'CASCADE',
  })
  questions: Question[]
}
