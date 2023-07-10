import { PaymentReqBody } from '@/protocols';
import ticketsRepository from '@/repositories/tickets-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';
import paymentsRepository from '@/repositories/payments-repository';

async function getTicketPayment(ticketId: number, userId: number){
    const ticketByTicketId = await ticketsRepository.findTicketByTicketId(ticketId);
    if(!ticketByTicketId) return 404;

    const user = await enrollmentRepository.findEnrollmentByUserId(ticketByTicketId.enrollmentId);
    if(user.userId !== userId) return 401;
    
    const payment = await paymentsRepository.findTicketPayment(ticketId);
    if(!payment) return 404;

    return payment
}

async function createPayment(body: PaymentReqBody, userId: number) {
    
    const ticket = await ticketsRepository.findTicketByTicketId(body.ticketId);
    if(!ticket) return 404;

    const user = await enrollmentRepository.findEnrollmentByUserId(ticket.enrollmentId);
    if(user.userId !== userId) return 401;

    const type = await ticketsRepository.findTicketByType(ticket.ticketTypeId);

    await ticketsRepository.updateStatusTicket(body.ticketId);

    const info = {
        ticketId: body.ticketId,
        cardIssuer: body.cardData.issuer,
        value: type.price,
        cardLastDigits: body.cardData.number.toString().slice(-4)
    }

    await paymentsRepository.createTicketPayment(info);
    const payment = await paymentsRepository.findTicketPayment(body.ticketId);
    return payment;

}


const paymentsService = {
    getTicketPayment,
    createPayment
}

export default paymentsService;