import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
// import bodyParser from 'body-parser';

import apiRouter from './routes/router';

dotenv.config();

const app = express();
const port: number = process.env['PORT'] ? parseInt(process.env['PORT']) : 3000;
const staticPath = path.join(__dirname, 'static');

// app.use(express.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/', express.static(staticPath));
app.use('/api', apiRouter);

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
