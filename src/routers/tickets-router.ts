import { Router } from "express";
import { authenticateToken } from "@/middlewares";

const ticketsRouter = Router();
import { getTicketsType, getUserTickets, createTicket } from "@/controllers/tickets-controller";

ticketsRouter
    // .all('/*', authenticateToken)
    .get('/types', getTicketsType)
    .get('/', getUserTickets)
    .post('/', createTicket)

export { ticketsRouter };
