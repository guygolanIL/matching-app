import { Router } from "express";

import * as imageControllers from './controllers/image';

export const profileRouter = Router();

profileRouter.get('/image', imageControllers.getImage);
profileRouter.post('/image', imageControllers.uploadImage);