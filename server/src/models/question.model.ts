import { Table, Model, Column, DataType, ForeignKey, HasMany, BelongsTo } from 'sequelize-typescript'

import { Optional } from 'sequelize/types';
import { Answer } from './answer.model';
import { Quest } from './quest.model';
import { User } from './user.model';
import UserAnswer from './user_answer.model';

interface QuestionAttributes {
    id: string,
    text: string,
    authorId: string,
    order: number,
    locationLink: string,
    questId: string,
    imgUrl: string | null,
}
interface QuestionCreationAttributes extends Optional<QuestionAttributes, 'id'> { }

@Table
export class Question extends Model<QuestionAttributes, QuestionCreationAttributes>{
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
    text: string
  
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        defaultValue: 0      
    })
    order: number

    @Column({
        allowNull: false
    })
    locationLink: string

    @Column({
        type: DataType.TEXT,
        allowNull: true
    })
    imgUrl: string

    @HasMany(() => Answer, {
        onDelete: 'CASCADE',
    })
    answers: Answer[]
 
    @HasMany(() => UserAnswer, {
        onDelete: 'CASCADE',
    })
    userAnsweredQuestions: UserAnswer[]

    @ForeignKey(() => User)
    @Column({ type: DataType.UUID, allowNull: false })
    authorId: string

    @ForeignKey(() => Quest)
    @Column({ type: DataType.UUID, allowNull: false })
    questId!: string

    @BelongsTo(() => Quest)
    quest: Quest

}
