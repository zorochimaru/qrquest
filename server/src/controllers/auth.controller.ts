import nodemailer from 'nodemailer';
import { NextFunction, Request, Response } from 'express';
import User, { ROLE, STATUS } from '../models/user.model';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'rasim.karimli@gmail.com',
        pass: 'opnablfa'
    }
});
class AuthController {
    signUp = async (req: Request, res: Response) => {
        const email = req.body.email;
        const name = req.body.name;
        const password = req.body.password;
        const confirmPassword = req.body.confirmPassword;
        if (password !== confirmPassword) {
            return res.status(400).send({ message: 'Passwords doesn\'t match' })
        }

        try {
            const findedUser = await User.findOne({ where: { email } });
            if (findedUser) {
                return res.status(409).send({ message: 'Already have this user' });
            }
            const hashedPass = await bcrypt.hash(password, 12);
            const newUser = User.build({ email, name, password: hashedPass, status: STATUS.NON_ACTIVE, role: ROLE.USER });
            const createdUser = await newUser.save();

            jwt.sign({
                user: createdUser.id,
            },
                process.env.EMAIL_SECRET,
                { expiresIn: '1h' },
                (err, emailToken) => {
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
                        } else {
                            res.send({ uiMessage: 'Email sent to: ' + info.envelope.to.toString() });
                        }
                    });
                });

        } catch (e) {
            res.status(400).send(e);
        }
    };

    resetPass = (req: Request, res: Response) => {
        const email = req.body.email;
        jwt.sign({
            email,
        },
            process.env.EMAIL_SECRET,
            { expiresIn: '1h' },
            async (err, token) => {
                try {
                    const findedUser = await User.findOne({ where: { email } });
                    if (findedUser) {
                        const url = `http://${process.env.HOST}:${process.env.PORT}/auth/confirm-password/${token}`;
                        const mailOptions = {
                            from: 'rasim.karimli@gmail.com',
                            to: email,
                            subject: 'Reset Password',
                            html: `Please click to this link to reset your's password: <a href="${url}">${url}</a>`
                        };
                        transporter.sendMail(mailOptions, function (error, info) {
                            if (error) {
                                return res.status(400).send(error);
                            }
                            res.send('Email sent to: ' + info.envelope.to.toString());
                        });
                    }
                } catch (e) {
                    res.status(400).send(e);
                }

            });
    }

    confirmPassword = async (req: Request, res: Response) => {
        const token = req.params.token;
        const newPassword = req.body.password;
        const confirmPassword = req.body.confirmPassword;
        if (newPassword !== confirmPassword) {
            return res.status(400).send('Passwords not match');
        }

        const email = jwt.verify(token, process.env.EMAIL_SECRET);
        const decryUserEmail = (email as any).email;
        try {
            const hashedPass = await bcrypt.hash(newPassword, 12);
            await User.update({ password: hashedPass }, { where: { email: decryUserEmail } });
            res.send('Confirmed');
        } catch (error) {
            return res.status(400).send(error);
        }
    }

    signIn = async (req: Request, res: Response) => {
        const email = req.body.email;
        const password = req.body.password;
        try {
            const findUser = await User.findOne({ where: { email } });
            if (!findUser) {
                return res.status(400).send({ message: 'No user with this email' });
            }

            if (findUser && findUser.status === STATUS.ACTIVE) {
                const doMatchPasswords = await bcrypt.compare(password, findUser.password);
                if (doMatchPasswords) {
                    const jwtPayload = {
                        userId: findUser.id,
                    }
                    const accessToken = jwt.sign(jwtPayload, process.env.JWT_SECRET, { expiresIn: '10s' });
                    const refreshToken = jwt.sign({ refreshToken: crypto.randomBytes(20).toString('hex') }, process.env.JWT_SECRET, { expiresIn: '15s' });
                    req.session.logedUser = {
                        user: findUser,
                        refreshToken
                    };
                    res.send({ accessToken });
                }
            }
            if (findUser && findUser.status === STATUS.NON_ACTIVE) {
                return res.status(400).send({ message: 'Acivate user' });
            }
            if (findUser && findUser.status === STATUS.BAN) {
                return res.status(400).send({ message: 'Your account is baned' });
            }
        } catch (e) {
            res.status(500).send({ message: e.toString() });
        }
    }

    logOut = async (req: Request, res: Response) => {
        req.session.destroy(err => {
            if (err) {
                return res.status(500).send(err);
            }
            res.sendStatus(200);
        })

    }

    refreshToken = async (req: Request, res: Response) => {
        const refreshToken = req.session.logedUser?.refreshToken;
        if (refreshToken) {
            jwt.verify(refreshToken, process.env.JWT_SECRET, (err, refreshT) => {
                if (err) {
                    res.clearCookie('connect.sid', {
                        path: '/',
                        //   secure: true,
                        httpOnly: true,
                    }).sendStatus(403);
                }
                const jwtPayload = {
                    userId: req.session.logedUser?.user.id,
                }
                const accessToken = jwt.sign(jwtPayload, process.env.JWT_SECRET, { expiresIn: '10s' });
                res.send({ accessToken });
            })
        } else {
            res.clearCookie('connect.sid', {
                path: '/',
                //   secure: true,
                httpOnly: true,
            }).sendStatus(403);
        }
    }

    confirm = async (req: Request, res: Response) => {
        const token = req.params.token;
        try {
            const user = jwt.verify(token, process.env.EMAIL_SECRET);
            const userId = (user as any).user;
            await User.update({ status: STATUS.ACTIVE }, { where: { id: userId } });
            res.send('Account activated');
        } catch (e) {
            res.status(401).send(String(e));
        }
    }

    getUser = async (req: Request, res: Response) => {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) return res.sendStatus(401);

        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) return res.sendStatus(403);
            if (user) {
                const sendUser = {
                    id: user.id,
                    status: user.status,
                    role: user.role,
                    name: user.name,
                    email: user.email,
                }
                res.send(sendUser);
            }
        })

    }


}
export default new AuthController();
