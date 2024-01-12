import express from 'express';
import cors from 'cors'
import router from '../routes';

import { errorMiddleware } from '../middleware/errorMiddleware';
import { prismaErrorMiddleware } from '../middleware/prismaErrorMiddleware';


export const web = express();

web.use(express.json());
web.use(cors())

web.use(router);

web.use(prismaErrorMiddleware, errorMiddleware)
