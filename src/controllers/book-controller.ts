import httpStatus from "http-status";
import { Response } from "express";
import bookingsService from "@/services/bookings-service";
import { AuthenticatedRequest } from "@/middlewares";

export async function postBooking(req: AuthenticatedRequest, res: Response) {
    const {roomId: roomIdString} = req.body as {roomId: string};
    const roomId = Number(roomIdString);
    const {userId} = req;
    
    if (!roomIdString) return res.sendStatus(httpStatus.BAD_REQUEST);
    if (isNaN(roomId)) return res.sendStatus(httpStatus.BAD_REQUEST);

    const booking = await bookingsService.postBooking(userId, roomId);
    if(booking === 403) return res.sendStatus(httpStatus.FORBIDDEN);
    if(booking === 404) return res.sendStatus(httpStatus.NOT_FOUND);
    return res.status(httpStatus.OK).send({bookingId: booking.id});
}

export async function putBooking (req: AuthenticatedRequest, res: Response) {
    const bookingId = Number(req.params.bookingId);
    const {roomId: roomIdString} = req.body as {roomId: string};
    const roomId = Number(roomIdString);
    const {userId} = req;
    
    if (!roomIdString) return res.sendStatus(httpStatus.BAD_REQUEST);
    if (isNaN(roomId)) return res.sendStatus(httpStatus.BAD_REQUEST);

    
    const booking = await bookingsService.updateBooking(bookingId, roomId, userId);
    if(booking === 403) return res.sendStatus(httpStatus.FORBIDDEN);
    if(booking === 404) return res.sendStatus(httpStatus.NOT_FOUND);
    return res.status(httpStatus.OK).send({bookingId: booking.id});
}

export async function getBooking (req: AuthenticatedRequest, res: Response) {
    const {userId} = req;

    
    const booking = await bookingsService.getBooking(userId);
    if(booking === 404) return res.sendStatus(httpStatus.NOT_FOUND);
    return res.status(httpStatus.OK).send(booking);
}