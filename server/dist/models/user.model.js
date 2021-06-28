"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.STATUS = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const sequelize_typescript_2 = require("sequelize-typescript");
var STATUS;
(function (STATUS) {
    STATUS[STATUS["ACTIVE"] = 0] = "ACTIVE";
    STATUS[STATUS["NON_ACTIVE"] = 1] = "NON_ACTIVE";
    STATUS[STATUS["BAN"] = 2] = "BAN";
})(STATUS = exports.STATUS || (exports.STATUS = {}));
;
let User = class User extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_2.DataType.UUID,
        defaultValue: sequelize_typescript_2.DataType.UUIDV4,
        allowNull: false,
        primaryKey: true,
        unique: true,
    }),
    __metadata("design:type", String)
], User.prototype, "id", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_2.DataType.STRING(15),
        allowNull: false
    }),
    __metadata("design:type", String)
], User.prototype, "status", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_2.DataType.STRING(30),
        allowNull: false
    }),
    __metadata("design:type", String)
], User.prototype, "name", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_2.DataType.STRING(64),
        allowNull: false,
    }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_2.DataType.STRING(30),
        field: 'email',
        unique: true,
        validate: {
            isEmail: {
                msg: 'Слышь! Псина! Имейл вводи!'
            }
        }
    }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
User = __decorate([
    sequelize_typescript_1.Table
], User);
exports.default = User;
