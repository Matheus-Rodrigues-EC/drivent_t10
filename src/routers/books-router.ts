import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { postBooking, getBooking, putBooking } from "@/controllers/book-controller";


export const bookingRouter = Router();

bookingRouter.use (authenticateToken);
bookingRouter.get ('/', getBooking);
bookingRouter.post ('/', postBooking);
bookingRouter.put ('/:bookingingId', putBooking);