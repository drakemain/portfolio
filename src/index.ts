import express, {Request, Response} from 'express';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
const port: number = process.env['PORT'] ? parseInt(process.env['PORT']) : 3000;
const staticPath = path.join(__dirname, 'static');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/static', express.static(staticPath));

app.get('/', (_req: Request, res: Response) => {
    res.sendFile(path.join(staticPath, 'html', 'index.html'));
});

app.get('/api/', (_req: Request, res: Response) => {
    res.send({payload: 'Test'});
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
