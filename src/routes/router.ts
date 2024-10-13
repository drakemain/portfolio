import express from 'express';
import dotenv from 'dotenv';

import DatabaseInterface from '../database';

dotenv.config();

const apiRouter = express.Router();
const db = new DatabaseInterface(process.env['DB_NAME'], process.env['DB_CRED']);
db.connect();

apiRouter.get('/about', async (_, res) => {
    const aboutContent = await db.getAbout();
    res.send(aboutContent);
});

apiRouter.get('/projects', async(_, res) => {
    const projects = await db.getProjects();
    res.send(projects);
});

apiRouter.get('/history', async(_, res) => {
    const history = await db.getWorkHistory();
    res.send(history);
});

export default apiRouter;
