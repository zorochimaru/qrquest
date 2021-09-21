import { Table, Model, Column, DataType, ForeignKey, HasMany } from 'sequelize-typescript'

import { Optional } from 'sequelize/types';
import { Answer } from './answer.model';
import { User } from './user.model';

interface QuestionAttributes {
    id: string,
    question: string,
    authorId: string,
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
    id!: string

    @Column({
        type: DataType.STRING(50),
        allowNull: true
    })
    question!: string

    @HasMany(() => Answer, 'questionId')
    answers!: Answer[]

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
