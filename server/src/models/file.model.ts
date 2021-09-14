import { Table, Model, Column, DataType} from 'sequelize-typescript'

import { Optional } from 'sequelize/types';


interface FileAttributes {
    id: string,
    fieldname: string,
    originalname: string,
    encoding: string,
    mimetype: string,
    destination: string,
    filename: string,
    path: string,
    size: number
}
interface FileCreationAttributes extends Optional<FileAttributes, 'id'> { }

@Table
export class File extends Model<FileAttributes, FileCreationAttributes>{
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        allowNull: false,
        primaryKey: true,
        unique: true,
    })
    id!: string

    @Column({
        type: DataType.STRING(100),
        allowNull: true
    })
    fieldname!: string
    @Column({
        type: DataType.STRING(100),
        allowNull: true
    })
    originalname!: string
    @Column({
        type: DataType.STRING(20),
        allowNull: true
    })
    encoding!: string
    @Column({
        type: DataType.STRING(30),
        allowNull: true
    })
    mimetype!: string
    @Column({
        type: DataType.STRING(100),
        allowNull: true
    })
    destination!: string
    @Column({
        type: DataType.STRING(100),
        allowNull: true
    })
    filename!: string
    @Column({
        type: DataType.STRING(100),
        allowNull: true
    })
    path!: string
    @Column({
        type: DataType.DOUBLE,
        allowNull: true
    })
    size!: number
}
 