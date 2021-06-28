import express from 'express';
import sequelize from './util/database';
import AuthRouter from './routes/auth.route';
import session from 'express-session';
import sequelizeStore from 'connect-session-sequelize'
import dotenv from 'dotenv';
 
dotenv.config({path: `.env.${process.env.NODE_ENV}`});
 
console.log(process.env.PORT);

console.log(process.env.NODE_ENV);


const SequelizeStore = sequelizeStore(session.Store);

const app = express();

const store = new SequelizeStore({
    db: sequelize,
});


app.use(express.urlencoded({ extended: true }));
app.use(express.json()) // To parse the incoming requests with JSON payloads
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Expose-Headers", "x-total-count");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH");
    res.header("Access-Control-Allow-Headers", "Content-Type,authorization");
    next();
});


app.use(session({
    secret: 'jojoisagay',
    resave: false,
    saveUninitialized: false,
    store
}))

app.use('/auth', AuthRouter);

app.use((_req, res) => {
    res.status(404).send('<h1>Page 404 not found</h1>')
});


sequelize
    .sync({ force: true })
    .then(() => {
        app.listen(process.env.PORT);
    }).catch(err => {
        console.log(err);
    })