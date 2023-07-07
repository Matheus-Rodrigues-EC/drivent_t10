import { Router } from "express";
import { authenticateToken } from "@/middlewares";

const ticketsRouter = Router();
import { getTicketsType } from "@/controllers/tickets-controller";

ticketsRouter
    .all('/*', authenticateToken)
    .get('/types', getTicketsType)
    .get('/')
    .post('/')

export { ticketsRouter };
