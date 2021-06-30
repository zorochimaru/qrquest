"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const user_model_1 = __importStar(require("../models/user.model"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: 'rasim.karimli@gmail.com',
        pass: 'opnablfa'
    }
});
class AuthController {
    constructor() {
        this.signUp = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const email = req.body.email;
            const name = req.body.name;
            const password = req.body.password;
            const confirmPassword = req.body.confirmPassword;
            if (password !== confirmPassword) {
                return res.status(400).send({ message: 'Passwords doesn\'t match' });
            }
            try {
                const findedUser = yield user_model_1.default.findOne({ where: { email } });
                if (findedUser) {
                    return res.status(409).send({ message: 'Already have this user' });
                }
                const hashedPass = yield bcrypt_1.default.hash(password, 12);
                const newUser = user_model_1.default.build({ email, name, password: hashedPass, status: user_model_1.STATUS.NON_ACTIVE });
                const createdUser = yield newUser.save();
                jsonwebtoken_1.default.sign({
                    user: createdUser.id,
                }, process.env.EMAIL_SECRET, { expiresIn: '1h' }, (err, emailToken) => {
                    const url = `http://${process.env.HOST}:${process.env.PORT}/auth/confirmation/${emailToken}`;
                    const mailOptions = {
                        from: 'rasim.karimli@gmail.com',
                        to: email,
                        subject: 'Confrim Email',
                        html: `Please click to this link to confirm your's account: <a href="${url}">${url}</a>`
                    };
                    transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                            res.status(400).send(error);
                        }
                        else {
                            res.send('Email sent to: ' + info.envelope.to.toString());
                        }
                    });
                });
            }
            catch (e) {
                res.status(400).send(e);
            }
        });
        this.signIn = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const email = req.body.email;
            const password = req.body.password;
            try {
                const findUser = yield user_model_1.default.findOne({ where: { email } });
                if (!findUser) {
                    return res.status(404).send({ message: 'No user with this email' });
                }
                const doMatchPasswords = yield bcrypt_1.default.compare(password, findUser.password);
                if (doMatchPasswords) {
                    req.session.isLoggedIn = true;
                    res.send({ name: findUser.name });
                }
            }
            catch (e) {
                res.status(400).send(e);
            }
        });
        this.logOut = (req, res) => __awaiter(this, void 0, void 0, function* () {
            req.session.destroy(err => {
                if (err) {
                    return res.status(500).send(err);
                }
                res.sendStatus(200);
            });
        });
        this.confirm = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const token = req.params.token;
            try {
                const user = jsonwebtoken_1.default.verify(token, process.env.EMAIL_SECRET);
                const userId = user.user;
                yield user_model_1.default.update({ status: user_model_1.STATUS.ACTIVE }, { where: { id: userId } });
                res.send('Account activated');
            }
            catch (e) {
                res.status(401).send(String(e));
            }
        });
    }
}
exports.default = new AuthController();
