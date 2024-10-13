import express from 'express';

const apiRouter = express.Router();

apiRouter.get('/hello', (_, res) => {
    res.send({payload: 'world'});
});

export default apiRouter;
