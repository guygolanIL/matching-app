import { Router } from 'express';

export const protectedRouter = Router();

protectedRouter.get('/', (req, res) => {
    console.log("hey you are authenticated", req.session);
    res.send('yay');
});