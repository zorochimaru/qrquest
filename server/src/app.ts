import express from 'express';
import sequelize from './util/database';
import AuthRouter from './routes/auth.route';
import NewsRouter from './routes/news.route';
import session from 'express-session';
import sequelizeStore from 'connect-session-sequelize'
import cors from "cors";

const SequelizeStore = sequelizeStore(session.Store);

const app = express();

const store = new SequelizeStore({
    db: sequelize,
});

// CORS
app.use(cors({ origin: ["http://localhost:3000", "http://192.168.31.175:3000"], credentials: true }));

app.use(express.urlencoded({ extended: true }));
app.use(express.json()) // To parse the incoming requests with JSON payloads

// SESSION
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store,
    cookie: {
        maxAge: 1000 * 60 * 60 * 6,
        path: '/',
        sameSite: true,
        httpOnly: true,
        secure: false,
    }
}))

// ROUTES
app.use('/auth', AuthRouter);

app.use('/news', NewsRouter);

// 404 PAGE
app.use((_req, res) => {
    res.status(404).send('<h1>Page 404 not found</h1>')
});

// LISTEN AFTER DB CONNECTION
sequelize
    .sync({ force: false })
    .then(() => {
        app.listen(process.env.PORT || 5000);
    }).catch(err => {
        console.log(err);
    })