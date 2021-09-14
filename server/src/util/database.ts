import { Sequelize } from 'sequelize-typescript';
import mysql2 from 'mysql2';
import { truncate } from 'fs';


const sequelize = new Sequelize({
    dialect: 'mysql',
    dialectModule: mysql2,
    database: process.env.DB_BASE,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASS,
    host: process.env.HOST,
    port: process.env.DB_PORT,
    modelPaths: [__dirname + '/../models/**/*.model.ts'],
    modelMatch: (filename, member) => {
        return filename.substring(0, filename.indexOf('.model')) === member.toLowerCase();
    },
});



export default sequelize;