import express from 'express';
import userRouter from './user.js';

let app = express();

app.use('/user/', userRouter);

export default app;
