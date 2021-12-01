import { Table, Model, Column, DataType, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript'

import { BOOLEAN, Optional } from 'sequelize/types';
import { Question } from './question.model';

interface AnswerAttributes {
    id: string;
    value: string;
    isRight: boolean;
    questionId: string;
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
    id: string

    @Column({
        type: DataType.STRING(50),
        allowNull: true
    })
    value: string

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false
    })
    isRight: boolean

    @ForeignKey(() => Question)
    @Column({ type: DataType.UUID, allowNull: false })
    questionId: string
    
}
