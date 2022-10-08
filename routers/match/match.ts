import { Router } from "express";
import { getMatches } from "./controllers/getMatches";

export const matchRouter = Router();

matchRouter.get(
    '/',
    getMatches
);
