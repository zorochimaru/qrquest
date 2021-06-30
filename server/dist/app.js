"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const database_1 = __importDefault(require("./util/database"));
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const express_session_1 = __importDefault(require("express-session"));
const connect_session_sequelize_1 = __importDefault(require("connect-session-sequelize"));
const SequelizeStore = connect_session_sequelize_1.default(express_session_1.default.Store);
const app = express_1.default();
const store = new SequelizeStore({
    db: database_1.default,
});
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json()); // To parse the incoming requests with JSON payloads
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Expose-Headers", "x-total-count");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH");
    res.header("Access-Control-Allow-Headers", "Content-Type,authorization");
    next();
});
app.use(express_session_1.default({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
    store,
}));
app.use('/auth', auth_route_1.default);
app.use((_req, res) => {
    res.status(404).send('<h1>Page 404 not found</h1>');
});
database_1.default
    .sync({ force: true })
    .then(() => {
    app.listen(process.env.PORT || 5000);
}).catch(err => {
    console.log(err);
});
