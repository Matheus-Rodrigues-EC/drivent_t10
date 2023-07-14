import httpStatus from "http-status";
import { Response } from "express";
import { AuthenticatedRequest } from "@/middlewares";
import hotelsService from "@/services/hotels-service";

export async function getHotels(req: AuthenticatedRequest, res: Response){
    const { userId } = req;

    try {
        const hotels = await hotelsService.getHotels(userId);
        if(hotels === 404) return res.sendStatus(httpStatus.NOT_FOUND);
        if(hotels === 402) return res.sendStatus(httpStatus.PAYMENT_REQUIRED);

        return res.status(httpStatus.OK).send(hotels)
    } catch (error) {
        return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
    }

}

export async function getHotelById(req: AuthenticatedRequest, res: Response){
    const hotelId = req.params.hotelid;
    const { userId } = req;

    if(!hotelId) return res.sendStatus(httpStatus.BAD_REQUEST);
    if(isNaN(Number(hotelId))) return res.sendStatus(httpStatus.BAD_REQUEST);

    try {
        const hotel = await hotelsService.getHotelById(Number(hotelId), userId);
        if(hotel === 404) return res.sendStatus(httpStatus.NOT_FOUND);
        if(hotel === 402) return res.sendStatus(httpStatus.PAYMENT_REQUIRED);
        
    } catch (error) {
        return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
    }

}