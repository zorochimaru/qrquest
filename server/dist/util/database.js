"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
const mysql2_1 = __importDefault(require("mysql2"));
const sequelize = new sequelize_typescript_1.Sequelize({
    dialect: 'mysql',
    dialectModule: mysql2_1.default,
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
exports.default = sequelize;
