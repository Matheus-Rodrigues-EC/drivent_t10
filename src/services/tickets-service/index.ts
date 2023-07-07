// import { Ticket } from "@prisma/client";
import ticketsRepository from "@/repositories/tickets-repository";

export async function getTypes() {

    const types = await ticketsRepository.findTicketsType();
    return types;
}