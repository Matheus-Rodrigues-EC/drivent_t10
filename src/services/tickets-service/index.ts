// import { Ticket } from "@prisma/client";
import ticketsRepository from "@/repositories/tickets-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";

export async function getTypes() {
    const types = await ticketsRepository.findTicketsType();
    return types;
}

export async function getTicketsByUserId(userId: number) {
    const user = await enrollmentRepository.findEnrollmentByUserId(userId);
    if(!user) return 404;

    const tickets = await ticketsRepository.findTicketsByUserId(userId);
    if(!tickets) return 404;

    return tickets;
}

export async function createTicket (ticketTypeId: number, userId: number) {
    if (!ticketTypeId) return 400;
    const enrollment = await enrollmentRepository.findEnrollmentByUserId(userId);
    if (!enrollment) return 404;
    return await ticketsRepository.addTicket(ticketTypeId, enrollment.id);
}

const ticketService = {
    getTypes,
    getTicketsByUserId,
    createTicket
}

export default ticketService;