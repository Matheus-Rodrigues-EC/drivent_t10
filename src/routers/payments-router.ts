import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { getTicketPaymentStatus, createPayment } from '@/controllers/payments-controller';

const paymentsRouter = Router();

paymentsRouter
    .all('/*', authenticateToken)
    .get('/', getTicketPaymentStatus)
    .post('/process', createPayment)

export { paymentsRouter };