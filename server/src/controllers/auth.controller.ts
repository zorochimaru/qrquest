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
        function sendEmailWithToken(userId: string) {
            jwt.sign({
                userId,
            },
                process.env.EMAIL_SECRET,
                { expiresIn: '1h' },
                (err, emailToken) => {
                    const url = `${process.env.DOMAIN}/confirmation/${emailToken}`;
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
                            res.send({ message: 'Email sent to: ' + info.envelope.to.toString() });
                        }
                    });
                });
        }
        if (password !== confirmPassword) {
            return res.status(400).send({ message: 'Passwords doesn\'t match' })
        }

        try {
            const findedUser = await User.findOne({ where: { email } });
            if (findedUser) {
                if (findedUser.status === STATUS.ACTIVE) {
                    res.status(400).send({ message: 'Already have this user, please login' });
                }
                if (findedUser.status === STATUS.NON_ACTIVE && findedUser.createdAt < new Date(Date.now() - (60 * 60 * 1000))) {
                    sendEmailWithToken(findedUser.id);
                }
                if (findedUser.status === STATUS.NON_ACTIVE && findedUser.createdAt > new Date(Date.now() - (60 * 60 * 1000))) {
                    res.status(409).send({ message: 'Already have this user, please activate or retry after 1 hour' });
                }

            }
            if (!findedUser) {
                const hashedPass = await bcrypt.hash(password, 12);
                const newUser = User.build({ email, name, password: hashedPass, status: STATUS.NON_ACTIVE, role: ROLE.USER });
                const createdUser = await newUser.save();

                sendEmailWithToken(createdUser.id);
            }



        } catch (e) {
            res.status(400).send(e);
        }
    };

    confirm = async (req: Request, res: Response) => {
        const token = req.params.token;

        try {

            jwt.verify(token, process.env.EMAIL_SECRET, async (err, userId) => {
                if (err) {
                    return res.status(400).send({ message: 'Confirmation token is out of date!' });
                }
                const id = (userId as any).userId;
                const updatedUser = await User.update({ status: STATUS.ACTIVE }, { where: { id, status: STATUS.NON_ACTIVE } });
                if (updatedUser[0]) {
                    res.sendStatus(200);
                } else {
                    res.status(400).send({ message: 'User already confirmed' });
                }

            })

        } catch (e) {
            res.status(400).send(String(e));
        }
    }

    resetPass = (req: Request, res: Response) => {
        const email = req.body.email;

        jwt.sign({
            email
        },
            process.env.EMAIL_SECRET,
            { expiresIn: '1h' },
            async (err, token) => {
                try {
                    const findedUser = await User.findOne({ where: { email } });
                    if (findedUser) {
                        const url = `${process.env.DOMAIN}/confirm-password/${token}`;
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
                            res.send({ message: 'Email sent to: ' + info.envelope.to.toString() });
                        });
                    } else {
                        res.status(400).send({ message: 'No user with this email' });
                    }
                } catch (e) {
                    res.status(400).send(e);
                }

            });
    }

    confirmPassword = async (req: Request, res: Response) => {
        const token = req.body.token;
        const password = req.body.password;
        const confirmPassword = req.body.confirmPassword;
        if (password !== confirmPassword) {
            return res.status(400).send({ message: 'Passwords doesn\'t match' })
        }


        const email = jwt.verify(token, process.env.EMAIL_SECRET);
        const decryUserEmail = (email as any).email;
        try {
            const hashedPass = await bcrypt.hash(password, 12);
            const updated = await User.update({ password: hashedPass }, { where: { email: decryUserEmail } });
            if (updated[0]) {
                res.send({ message: 'Password successfully has been reset' });
            } else {
                res.status(400).send({ message: 'No user with this email' });
            }
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
                    const accessToken = await jwt.sign(jwtPayload, process.env.JWT_SECRET, { expiresIn: '30m' });
                    const refreshToken = await jwt.sign({ refreshToken: crypto.randomBytes(20).toString('hex') }, process.env.JWT_SECRET, { expiresIn: '6h' });
                    req.session.logedUser = {
                        user: findUser,
                        refreshToken
                    };

                    res.send({ accessToken });

                } else {
                    res.status(400).send({ message: 'Wrong password!' });
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
            res.clearCookie('connect.sid').sendStatus(200);
        })

    }

    refreshToken = async (req: Request, res: Response) => {
        const refreshToken = req.session.logedUser?.refreshToken;
        if (refreshToken) {
            jwt.verify(refreshToken, process.env.JWT_SECRET, (err, refreshT) => {
                if (err) {
                    res.clearCookie('connect.sid').sendStatus(403);
                }
                const jwtPayload = {
                    userId: req.session.logedUser?.user.id,
                }
                const accessToken = jwt.sign(jwtPayload, process.env.JWT_SECRET, { expiresIn: '30m' });
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

    getUser = async (req: Request, res: Response) => {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) return res.sendStatus(401);

        jwt.verify(token, process.env.JWT_SECRET, async (err, userIdPayload) => {
            if (err) return res.sendStatus(403);
            if (userIdPayload) {
                const userId = userIdPayload.userId;
                const findUser = await User.findOne({ where: { id: userId } });
                if (findUser) {
                    const sendUser = {
                        id: findUser.id,
                        status: findUser.status,
                        role: findUser.role,
                        name: findUser.name,
                        email: findUser.email,
                    }
                    res.send(sendUser);
                }
                res.sendStatus(401);
            }
        })

    }


}
export default new AuthController();
