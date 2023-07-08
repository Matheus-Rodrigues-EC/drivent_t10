// import { Ticket } from "@prisma/client";
import { prisma } from "@/config";


async function findTicketsType(){
    return prisma.ticketType.findMany()
}

async function findTicketsById(userId: number) {
    return prisma.ticket.findFirst({
        where:{
            id: userId
        }
    })
}

async function findTicketByTicketId (ticketId: number){
    return await prisma.ticket.findFirst({
        where: {
            id: ticketId
        }
    })
}

async function findTicketByType (id: number){
    return await prisma.ticketType.findUnique({
        where: {
            id
        }
    })
}


async function addTicket(ticketTypeId: number, enrollmentId: number){
    return prisma.ticket.create({
        data: {
            ticketTypeId: ticketTypeId,
            status: "RESERVED",
            enrollmentId: enrollmentId
        }
    })

}

async function updateStatusTicket(ticketId: number){
    return prisma.ticket.update({
        where:  { id: ticketId },
        data:   { status: 'PAID' }
    })
}




const ticketsRepository = {
    findTicketsType,
    findTicketsById,
    findTicketByTicketId,
    findTicketByType,
    addTicket,
    updateStatusTicket
}

export default ticketsRepository;