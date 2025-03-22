import express from 'express';
import { authController } from '../controller/index.js';

const authRouter = new express.Router();

authRouter.post('/registration', authController.registration);

export default authRouter;
