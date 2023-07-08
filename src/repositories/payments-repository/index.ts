import { Payment } from "@prisma/client";
import { prisma } from "@/config";

async function findTicketPayment(ticketId: number){
    return await prisma.payment.findFirst({
        where: {
            ticketId
        }
    })
}

type PaymentRequest = Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>;

async function createTicketPayment(payment: PaymentRequest) {
    return prisma.payment.create({
        data: payment
    })
}



const paymentsRepository = {
    findTicketPayment,
    createTicketPayment
}

export default paymentsRepository;