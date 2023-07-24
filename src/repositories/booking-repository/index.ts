import { prisma } from "@/config";

async function addBooking (userId: number, roomId: number) {
    return prisma.booking.create({
        data: {
            userId,
            roomId,
        },
    });
}

async function findRoomAndItsBooking (roomId: number) {
    return prisma.room.findFirst({
        where: {
            id: roomId
        },
        include: {
            Booking: true,
        },
    });
}

async function findBookingWithRoomData (userId: number){
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

async function putBooking (bookingId: number, roomId: number){
    return prisma.booking.update({
        where: {
            id: bookingId
        },
        data: {
            roomId
        }
    })
}

const bookingRepository = {
    addBooking,
    findRoomAndItsBooking,
    findBookingWithRoomData,
    putBooking
}

export default bookingRepository;