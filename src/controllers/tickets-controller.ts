import { Response } from "express";
import httpStatus from "http-status";
import { getTypes } from "../services/tickets-service";
import { AuthenticatedRequest } from "@/middlewares";

export async function getTicketsType(req: AuthenticatedRequest, res: Response) {
    try {
        
        const types = await getTypes();

        return res.status(200).send(types);
    } catch (error) {
        return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR)
    }
}