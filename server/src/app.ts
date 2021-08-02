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
// app.set('trust proxy', 'loopback') // specify a single subnet
app.use(express.urlencoded({ extended: true }));
app.use(express.json()) // To parse the incoming requests with JSON payloads

function isAuth(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.JWT_SECRET as string, (err: any, user: any) => {
        console.log(err)
        if (err) return res.sendStatus(401)
        next()
    })
}

//payload can be userID, email or other user details
function generateAccessToken(payload: any, ip_address: string) {
    return new Promise(function (resolve, reject) {
        let tokens: { accessToken: string, refreshToken: string } = {
            accessToken: jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5m' }), //generating refresh token
            refreshToken: jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '6h' })
        }
        resolve(tokens);
    })
};
app.use(session({
    // !change secret
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
    store,
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