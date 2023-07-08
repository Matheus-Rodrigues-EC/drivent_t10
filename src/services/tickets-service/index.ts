// import { Ticket } from "@prisma/client";
import ticketsRepository from "@/repositories/tickets-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import { notFoundError, requestError } from '@/errors';

export async function getTypes() {
    const types = await ticketsRepository.findTicketsType();
    return types;
}

export async function getTicketsUserById(userId: number) {
    
    const user = await enrollmentRepository.findEnrollmentByUserId(userId);
    if(!user) throw notFoundError();

    const tickets = await ticketsRepository.findTicketsById(userId);
    if(!tickets) throw notFoundError();

    return tickets;
}

export async function createTicket (ticketTypeId: number, userId: number) {
    if (!ticketTypeId) throw requestError(400, 'BAD_REQUEST');
    const enrollment = await enrollmentRepository.findEnrollmentByUserId(userId);
    if (!enrollment) throw notFoundError();
    return await ticketsRepository.addTicket(ticketTypeId, enrollment.id);
}

const ticketService = {
    getTypes,
    getTicketsUserById,
    createTicket
}

export default ticketService;