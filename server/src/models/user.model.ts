
import { Table, Model, Column, BelongsToMany } from 'sequelize-typescript'
import { DataType } from 'sequelize-typescript';
import { Optional } from 'sequelize/types';
import { Answer } from './answer.model';
import UserAnswer from './user_answer.model';

export enum STATUS {
  'ACTIVE' = 'ACTIVE',
  'NON_ACTIVE' = 'NON_ACTIVE',
  'BAN' = 'BAN'
};
export enum ROLE {
  'ADMIN' = 'ADMIN',
  'USER' = 'USER'
}
interface UserAttributes {
  id: string
  name: string
  email: string,
  password: string,
  status: STATUS,
  role: ROLE,
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> { }

@Table
export class User extends Model<UserAttributes, UserCreationAttributes> {
  @BelongsToMany(() => Answer, () => UserAnswer)
  answers: Answer[]
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
    primaryKey: true,
    unique: true,
  })
  id!: string

  @Column({
    type: DataType.STRING(15),
    allowNull: false,
    defaultValue: STATUS.NON_ACTIVE
  })
  status!: STATUS

  @Column({
    type: DataType.STRING(15),
    allowNull: false,
    defaultValue: ROLE.USER
  })
  role!: ROLE

  @Column({
    type: DataType.STRING(30),
    allowNull: false
  })
  name!: string

  @Column({
    type: DataType.STRING(64),
    allowNull: false,
  })
  password!: string

  @Column({
    type: DataType.STRING(30),
    field: 'email',
    unique: true,
    validate: {
      isEmail: {
        msg: 'Email is required!'
      }
    }
  })
  email!: string;
}