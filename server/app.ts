import express from 'express';

const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.json()) // To parse the incoming requests with JSON payloads

app.use((_req, res) => {
    res.status(404).send('<h1>Page 404 not found</h1>')
});

app.listen(process.env.PORT || 5000);