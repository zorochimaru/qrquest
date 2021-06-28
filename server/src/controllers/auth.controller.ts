import nodemailer from 'nodemailer';
import { Request, Response } from 'express';
import User, { STATUS } from '../models/user.model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'rasim.karimli@gmail.com',
        pass: 'opnablfa'
    }
});
class AuthController {
    public signUp = async (req: Request, res: Response) => {
        const email = req.body.email;
        const name = req.body.name;
        const password = req.body.password;
        const confirmPassword = req.body.confirmPassword;
        try {
            const findedUser = await User.findOne({ where: { email } });
            if (findedUser) {
                return res.status(409).send({ message: 'Already have this user' });
            }
            const hashedPass = await bcrypt.hash(password, 12);
            const newUser = User.build({ email, name, password: hashedPass, status: STATUS.NON_ACTIVE });
            const createdUser = await newUser.save();

            jwt.sign({
                user: createdUser.id,
            },
            process.env.EMIAL_SECRET,
            {expiresIn: '1h'},
            (err,emailToken)=>{
                const url = ``
            })
            

            const mailOptions = {
                from: 'rasim.karimli@gmail.com',
                to: email,
                subject: 'Sending Email using Node.js',
                text: 'That was easy!'
            };

            await transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    res.status(400).send(error);
                } else {
                    res.send('Email sent to: ' + info.envelope.to.toString());
                }
            });
        } catch (e) {
            res.status(400).send(e);
        }
    };

    public signIn = async (req: Request, res: Response) => {
        const email = req.body.email;
        const password = req.body.password;
        try {
            const findUser = await User.findOne({ where: { email } });
            if (!findUser) {
                return res.status(404).send({ message: 'No user with this email' });
            }
            const doMatchPasswords = await bcrypt.compare(password, findUser.password);
            if (doMatchPasswords) {
                req.session.isLoggedIn = true;
                res.send({ name: findUser.name });
            }
        } catch (e) {
            res.status(400).send(e);
        }
    }

    public logOut = async (req: Request, res: Response) => {
        req.session.destroy(err => {
            if (err) {
                return res.status(500).send(err);
            }
            res.sendStatus(200);
        })

    }
}
export default new AuthController();
