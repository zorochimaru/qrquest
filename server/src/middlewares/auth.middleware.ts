import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

function isAuth(req: Request, res: Response, next: NextFunction) {

    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET as string, (err: any) => {

        if (err) {
            console.log(err);
            return res.sendStatus(401);
        }
        next();
    })
}
export default isAuth;