"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = __importDefault(require("../controllers/auth.controller"));
const router = express_1.Router();
router.post('/signup', auth_controller_1.default.signUp);
router.post('/signin', auth_controller_1.default.signIn);
router.post('/logout', auth_controller_1.default.logOut);
router.get('/confirmation/:token', auth_controller_1.default.confirm);
exports.default = router;
