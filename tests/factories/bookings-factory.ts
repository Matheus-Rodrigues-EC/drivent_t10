import { faker } from "@faker-js/faker";
import { prisma } from "@/config";


export async function createBooking (userId: number, roomId: number){
    return prisma.booking.create({
        data: {
            userId,
            roomId,
        },
    });
}


export function buildBooking (roomId: number, hotelId: number) {
    return ({
        id: faker.datatype.number({ min: 1 }),
        Room: {
            id: roomId,
            name: faker.name.findName(),
            capacity: faker.datatype.number(),
            hotelId,
            createdAt: new Date(),
            updatedAt: new Date(),
        }
    })
}


export function buildRoomWithCapacityFull (){
    return ({
        id: 1,
        name: faker.name.findName(),
        capacity: 1,
        hotelId: faker.datatype.number({ min: 1 }),
        createdAt: new Date(),
        updatedAt: new Date(),
        Booking: [
            {
                id: faker.datatype.number({ min: 1 }),
                userId: 1,
                roomId: 1,
                createdAt: new Date(),
                updatedAt: new Date(),
            }
        ]
    })
}


export function getBookingWithRoomData (userId: number){
    return prisma.booking.findFirst({
        where: {
            userId
        },
        select: {
            id: true,
            Room: true,
        }
    })
}