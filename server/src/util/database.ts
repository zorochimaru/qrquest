import { Sequelize } from 'sequelize-typescript';
import mysql2 from 'mysql2';



const sequelize = new Sequelize({
    dialect: 'mysql',
    dialectModule: mysql2,
    database: 'quest',
    username: 'root',
    password: 'zorochimaru',
    host: 'localhost',
    port: process.env.DB_PORT,
    modelPaths: [__dirname + '/../models/**/*.model.ts'],
    modelMatch: (filename, member) => {
        return filename.substring(0, filename.indexOf('.model')) === member.toLowerCase();
    },
});



export default sequelize;