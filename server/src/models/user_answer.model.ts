import { Table, Model, Column, ForeignKey, DataType } from 'sequelize-typescript'
import { Optional } from 'sequelize/types';
import { User } from './user.model';
import { Answer } from './answer.model';
import { Quest } from './quest.model';
import { Question } from './question.model';
interface UserAnswerAttributes {
  id: string;
  userId: string;
  answerId: string;
  questionId: string;
  questId: string;
}
interface UserAnswerCreationAttributes extends Optional<UserAnswerAttributes, 'id'> { }
@Table({ modelName: 'user_anwer' })
export default class UserAnswer extends Model<UserAnswerAttributes, UserAnswerCreationAttributes>{
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
    primaryKey: true,
    unique: true,
  })
  id: string

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false })
  userId: string

  @ForeignKey(() => Answer)
  @Column({ type: DataType.UUID, allowNull: false })
  answerId: string

  @ForeignKey(() => Question)
  @Column({ type: DataType.UUID, allowNull: false })
  questionId: string

  @ForeignKey(() => Quest)
  @Column({ type: DataType.UUID, allowNull: false })
  questId: string
}
