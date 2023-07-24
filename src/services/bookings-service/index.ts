
import bookingRepository from '@/repositories/booking-repository';
import ticketsRepository from '@/repositories/tickets-repository';

async function postBooking(userId: number, roomId: number) {
    const tickets = await ticketsRepository.findUserTickets (userId);
    const ticket = tickets[0];

    if (ticket.TicketType.isRemote || !ticket.TicketType.includesHotel || ticket.status !== "PAID") {
        return 403;
    }

    const room = await bookingRepository.findRoomAndItsBooking(roomId);
    if (!room) return 404;

    if (room.Booking.length === room.capacity) return 403;
    
    return await bookingRepository.addBooking(userId, roomId);
}

async function updateBooking (bookingId: number, roomId: number, userId: number){
    const booking = await bookingRepository.findBookingWithRoomData (userId);
    if (!booking) return 403;

    const room = await bookingRepository.findRoomAndItsBooking(roomId);
    if (!room) return 404;

    if (room.Booking.length === room.capacity) return 403;

    return await bookingRepository.putBooking(bookingId, roomId);
}

async function getBooking (userId: number){
    const booking = await bookingRepository.findBookingWithRoomData (userId);
    if (!booking) return 404;
    return booking;
}

const bookingsService = {
    postBooking,
    updateBooking,
    getBooking
}

export default bookingsService;