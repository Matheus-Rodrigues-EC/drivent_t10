import hotelRepository from '@/repositories/hotel-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';
import ticketsRepository from '@/repositories/tickets-repository';

async function getHotels(userId: number){
    const user = await enrollmentRepository.findById(userId);
    if(!user) return 404;
    const ticket = await ticketsRepository.findTicketByEnrollmentId(user.id);
    if(!ticket) return 404;
    const ticketType = await ticketsRepository.getTicketByType(ticket.ticketTypeId);

    if(ticket.status === "RESERVED" || ticketType.isRemote === true || ticketType.includesHotel === false) return 402;

    const hotels = await hotelRepository.findHotels();
    if(hotels.length === 0) return 404;
    return hotels;
}

async function getHotelById(hotelId: number, userId: number){
    const user = await enrollmentRepository.findById(userId);
    if(!user) return 404;
    const ticket = await ticketsRepository.findTicketByEnrollmentId(user.id);
    if(!ticket) return 404;
    const ticketType = await ticketsRepository.getTicketByType(ticket.ticketTypeId);

    if(ticket.status === "RESERVED" || ticketType.isRemote === true || ticketType.includesHotel === false) return 402;

    const hotel = await hotelRepository.findHotelById(hotelId);
    if(!hotel) return 404;
    return hotel
}

const hotelsService = { getHotels, getHotelById };

export default hotelsService;