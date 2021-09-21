import { Table, Model, Column, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript'

import { Optional } from 'sequelize/types';
import { Question } from './question.model';

interface AnswerAttributes {
    id: string,
    value: string,
    questionId: string,
}
interface AnswerCreationAttributes extends Optional<AnswerAttributes, 'id'> { }

@Table
export class Answer extends Model<AnswerAttributes, AnswerCreationAttributes>{

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
    value!: string
}
