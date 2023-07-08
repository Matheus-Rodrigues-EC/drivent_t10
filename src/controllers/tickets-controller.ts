import { Request, Response } from "express";
import httpStatus from "http-status";
import { Ticket } from "@prisma/client";
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
    const userId = Number(req.headers.userid);
    try {
        const tickets = await ticketService.getTicketsUserById(userId);
        if(tickets === httpStatus.NOT_FOUND) return res.sendStatus(httpStatus.NOT_FOUND);

        return res.status(200).send(tickets);
    } catch (error) {
        return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
    }
}

export async function createTicket(req: AuthenticatedRequest, res: Response){
    const {ticketTypeId} = req.body as {ticketTypeId: number};
    const {userId} = req;
    
    try {
        await ticketService.createTicket(ticketTypeId, userId);
        const ticket = await ticketService.getTicketsUserById(userId);
        return res.status(httpStatus.CREATED).send(ticket);
    } catch (error) {
        return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
        
    }
}