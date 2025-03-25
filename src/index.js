import express from 'express';
import { authRouter, userRouter } from './router/index.js';
import { authMiddleware } from './middleware/index.js';

const app = express();
const port = process.env.SERVER_PORT;

app.use(express.json());

app.use('/', authRouter);
app.use('/user', authMiddleware, userRouter);

// eslint-disable-next-line no-console
app.listen(port, () => console.log(`server listen on ${port} port`));
