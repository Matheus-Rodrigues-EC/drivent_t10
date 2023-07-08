import { Prisma, Ticket, TicketType } from "@prisma/client";
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

type TicketResult =  Ticket & {
    ticketType: TicketType
}

async function findTicketsByUserId(userId: number): Promise<TicketResult[]> {
    return await prisma.$queryRaw(
        Prisma.sql`
        SELECT
        "Ticket".id,
        "Ticket".status,
        "Ticket"."ticketTypeId",
        "Ticket"."enrollmentId",
        json_build_object(
            'id', "TicketType".id,
            'name', "TicketType".name,
            'price', "TicketType".price,
            'isRemote', "TicketType"."isRemote",
            'includesHotel', "TicketType"."includesHotel",
            'createdAt', to_char("TicketType"."createdAt", 'YYYY-MM-DD"T"HH24:MI:SS.MSZ'),
            'updatedAt', to_char("TicketType"."updatedAt", 'YYYY-MM-DD"T"HH24:MI:SS.MSZ')
        ) AS "TicketType",
            to_char("Ticket"."createdAt", 'YYYY-MM-DD"T"HH24:MI:SS.MSZ') AS "createdAt",
            to_char("Ticket"."updatedAt", 'YYYY-MM-DD"T"HH24:MI:SS.MSZ') AS "updatedAt"
        FROM
            "Enrollment"
            JOIN
            "Ticket" ON "Enrollment".id = "Ticket"."enrollmentId"
            JOIN
            "TicketType" ON "Ticket"."ticketTypeId" = "TicketType".id
        WHERE
            "Enrollment"."userId" = ${userId};
        `
    );
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
    findTicketsByUserId,
    addTicket,
    updateStatusTicket
}

export default ticketsRepository;