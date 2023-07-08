// import { Ticket } from "@prisma/client";
import httpStatus from "http-status";
import ticketsRepository from "@/repositories/tickets-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";

export async function getTypes() {
    const types = await ticketsRepository.findTicketsType();
    return types;
}

export async function getTicketsUserById(userId: number) {
    
    const user = await enrollmentRepository.findEnrollmentByUserId(userId);
    if(!user) return httpStatus.NOT_FOUND;

    const tickets = await ticketsRepository.findTicketsById(userId);
    if(!tickets) return httpStatus.NOT_FOUND;

    return tickets;
}

export async function createTicket (ticketTypeId: number, userId: number) {
    if (!ticketTypeId) return httpStatus.BAD_REQUEST
    const enrollment = await enrollmentRepository.findEnrollmentByUserId(userId);
    if (!enrollment) return httpStatus.NOT_FOUND
    return await ticketsRepository.addTicket(ticketTypeId, enrollment.id);
}

const ticketService = {
    getTypes,
    getTicketsUserById,
    createTicket
}

export default ticketService;