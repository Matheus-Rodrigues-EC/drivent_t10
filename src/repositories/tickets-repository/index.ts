// import { Ticket } from "@prisma/client";
import { prisma } from "@/config";

async function findTicketsType(){
    return prisma.ticketType.findMany()
}

const ticketsRepository = {
    findTicketsType
}

export default ticketsRepository;