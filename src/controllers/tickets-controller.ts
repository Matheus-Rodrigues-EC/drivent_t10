import { Response } from "express";
import httpStatus from "http-status";
import ticketService from "@/services/tickets-service";
import { AuthenticatedRequest } from "@/middlewares";

export async function getTicketsType(req: AuthenticatedRequest, res: Response) {
    try {
        const types = await ticketService.getTypes();

        return res.status(200).send(types);
    } catch (error) {
        return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
    }
}

export async function getUserTickets(req: AuthenticatedRequest, res: Response) {
    const userId = Number(req.userId);
    if(!userId) return res.sendStatus(httpStatus.NOT_FOUND);
    try {
        const tickets = await ticketService.getTicketsByUserId(userId);
        if(tickets === 404) return res.sendStatus(httpStatus.NOT_FOUND);

        return res.status(200).send(tickets);
    } catch (error) {
        return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
    }
}

export async function createTicket(req: AuthenticatedRequest, res: Response){
    const {ticketTypeId} = req.body as {ticketTypeId: number};
    const {userId} = req;
    if(!ticketTypeId) return res.sendStatus(httpStatus.BAD_REQUEST);
    
    try {
        const verify = await ticketService.createTicket(ticketTypeId, userId);
        if(verify === 400) return res.sendStatus(httpStatus.BAD_REQUEST);
        if(verify === 404) return res.sendStatus(httpStatus.NOT_FOUND);
        const ticket = await ticketService.getTicketsByUserId(userId);
        return res.status(httpStatus.CREATED).send(ticket);
    } catch (error) {
        return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
        
    }
}