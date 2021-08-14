import express, { NextFunction, Request, Response } from 'express';
import sequelize from './util/database';
import AuthRouter from './routes/auth.route';
import session from 'express-session';
import sequelizeStore from 'connect-session-sequelize'
import cors from "cors";
import jwt from 'jsonwebtoken';
const SequelizeStore = sequelizeStore(session.Store);

const app = express();

const store = new SequelizeStore({
    db: sequelize,
});



app.use(cors({ origin: "http://localhost:3000", credentials: true }));
// app.set('trust proxy', 1) // specify a single subnet
app.use(express.urlencoded({ extended: true }));
app.use(express.json()) // To parse the incoming requests with JSON payloads

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

app.use(session({
    // !change secret
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
    store,
    // cookie: {
    // maxAge: 1000 * 60 * 60 * 6,
    // path: '/',
    // sameSite: 'lax',
    // httpOnly: true,
    // secure: true,
    // }
}))

app.use('/auth', AuthRouter);

app.get('/test', isAuth, (req, res, next) => {
    res.send(`${13}`)
})

app.use((_req, res) => {
    res.status(404).send('<h1>Page 404 not found</h1>')
});


sequelize
    .sync({ force: true })
    .then(() => {
        app.listen(process.env.PORT || 5000);
    }).catch(err => {
        console.log(err);
    })