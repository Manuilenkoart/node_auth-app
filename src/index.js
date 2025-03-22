import express from 'express';
import { authRouter } from './router/index.js';

const app = express();
const port = process.env.SERVER_PORT;

app.use(express.json());

app.use('/', authRouter);

// eslint-disable-next-line no-console
app.listen(port, () => console.log(`server listen on ${port} port`));
