import { Ticket, TicketType } from "@prisma/client";
import { prisma } from "@/config";


async function findTicketsType(){
    return prisma.ticketType.findMany()
}

async function findTicketsById(userId: number) {
    return prisma.ticket.findFirst({
        where:{
            id: userId
        },
        include: {TicketType: true}
    })
}

async function findTicketByTicketId (ticketId: number){
    return await prisma.ticket.findFirst({
        where: {
            id: ticketId
        },
        include: {TicketType: true}
    })
}

async function findTicketByType (id: number){
    return await prisma.ticketType.findUnique({
        where: {
            id
        }
    })
}


async function findTicketsByUserId(enrollmentId: number){
    return await prisma.ticket.findFirst({
        where: { enrollmentId },
        include: { TicketType: true }
    });
}

async function addTicket(ticketTypeId: number, enrollmentId: number){
    return prisma.ticket.create({
        data: {
            ticketTypeId: ticketTypeId,
            status: "RESERVED",
            enrollmentId: enrollmentId
        },
        include: {TicketType: true}
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
    findTicketsByUserId,
    addTicket,
    updateStatusTicket
}

export default ticketsRepository;