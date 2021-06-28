
import { Table, Model, Column } from 'sequelize-typescript'
import { DataType } from 'sequelize-typescript';
import { Optional } from 'sequelize/types';
export enum STATUS {
  'ACTIVE',
  'NON_ACTIVE',
  'BAN'
};

interface UserAttributes {
  id: string
  name: string
  email: string,
  password: string,
  status: STATUS
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> { }

@Table
class User extends Model<UserAttributes, UserCreationAttributes> {
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
    allowNull: false
  })
  status!: string

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
        msg: 'Слышь! Псина! Имейл вводи!'
      }
    }
  })
  email!: string;
}
export default User;