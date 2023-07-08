import { Ticket } from "@prisma/client";
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



async function addTicket(ticketTypeId: number, enrollmentId: number){
    return prisma.ticket.create({
        data: {
            ticketTypeId: ticketTypeId,
            status: "RESERVED",
            enrollmentId: enrollmentId
        }
    })

}




const ticketsRepository = {
    findTicketsType,
    findTicketsById,
    addTicket
}

export default ticketsRepository;