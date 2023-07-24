import {    buildBooking, 
            buildRoomWithCapacityFull, 
            buildTicket 
        } from "../factories";
import ticketsRepository from "@/repositories/tickets-repository";
import bookingsService from "@/services/bookings-service";
import bookingsRepository from "@/repositories/booking-repository";

beforeEach(async () => {
    jest.clearAllMocks();
});

describe("Create booking", () => {
    it ("Should throw an error when given ticket is remote", async () => {
        const enrollmentId = 1;
        const userId = 1;
        const roomId = 1;
        const ticket = buildTicket(enrollmentId, true, false, "RESERVED");
        jest.spyOn(ticketsRepository, "findUserTickets").mockResolvedValue([ticket]);
        const promise = bookingsService.postBooking(userId, roomId);

        expect(promise).rejects.toEqual({
            name: 'ForbiddenError',
            message: 'Not authorized to access this resource!',
        })
    })
    it ("Should throw an error when given ticket doesn't include hotel", async () => {
        const enrollmentId = 1;
        const userId = 1;
        const roomId = 1;
        const ticket = buildTicket(enrollmentId, true, false, "RESERVED");
        jest.spyOn(ticketsRepository, "findUserTickets").mockResolvedValue([ticket]);
        const promise = bookingsService.postBooking(userId, roomId);

        expect(promise).rejects.toEqual({
            name: 'ForbiddenError',
            message: 'Not authorized to access this resource!',
        })
    })
    it ("Should throw an error when given ticket hasn't been paid", async () => {
        const enrollmentId = 1;
        const userId = 1;
        const roomId = 1;
        const ticket = buildTicket(enrollmentId, true, false, "RESERVED");
        jest.spyOn(ticketsRepository, "findUserTickets").mockResolvedValue([ticket]);
        const promise = bookingsService.postBooking(userId, roomId);

        expect(promise).rejects.toEqual({
            name: 'ForbiddenError',
            message: 'Not authorized to access this resource!',
        })
    })
    it ("Should throw an error when room doesn't exists", async () => {
        const enrollmentId = 1;
        const userId = 1;
        const roomId = 1;
        const ticket = buildTicket(enrollmentId, false, true, "PAID");
        jest.spyOn(ticketsRepository, "findUserTickets").mockResolvedValue([ticket]);
        jest.spyOn(bookingsRepository, "findRoomAndItsBooking").mockResolvedValue(undefined);
        const promise = bookingsService.postBooking(userId, roomId);

        expect(promise).rejects.toEqual({
            name: 'NotFoundError',
            message: 'No result for this search!',
        })
    })
    it ("Should throw an error when room capacity is full", async () => {
        const enrollmentId = 1;
        const userId = 2;
        const roomId = 1;
        const ticket = buildTicket(enrollmentId, false, true, "PAID");
        jest.spyOn(ticketsRepository, "findUserTickets").mockResolvedValue([ticket]);
        jest.spyOn(bookingsRepository, "findRoomAndItsBooking").mockResolvedValue(buildRoomWithCapacityFull());
        const promise = bookingsService.postBooking(userId, roomId);

        expect(promise).rejects.toEqual({
            name: 'ForbiddenError',
            message: 'Not authorized to access this resource!',
        })
    })
})

describe("update booking", () => {
    it ("Should throw an error when user doesn't have booking", async () => {
        const userId = 1;
        const roomId = 1;
        const bookingId = 1;
        jest.spyOn(bookingsRepository, "findBookingWithRoomData").mockResolvedValue(undefined);
        const promise = bookingsService.updateBooking(bookingId, roomId, userId);

        expect(promise).rejects.toEqual({
            name: 'ForbiddenError',
            message: 'Not authorized to access this resource!',
        })
    })
    it ("Should throw an error when room doesn't exists", async () => {
        const userId = 1;
        const roomId = 1;
        const bookingId = 1;
        const hotelId = 1;
        jest.spyOn(bookingsRepository, "findBookingWithRoomData").mockResolvedValue(buildBooking(roomId, hotelId));
        jest.spyOn(bookingsRepository, "findRoomAndItsBooking").mockResolvedValue(undefined);
        const promise = bookingsService.updateBooking(bookingId, roomId, userId);

        expect(promise).rejects.toEqual({
            name: 'NotFoundError',
            message: 'No result for this search!',
        })
    })
    it ("Should throw an error when room's capacity is full", async () => {
        const userId = 1;
        const roomId = 2;
        const bookingId = 1;
        const hotelId = 1;
        jest.spyOn(bookingsRepository, "findBookingWithRoomData").mockResolvedValue(buildBooking(roomId, hotelId));
        jest.spyOn(bookingsRepository, "findRoomAndItsBooking").mockResolvedValue(buildRoomWithCapacityFull());
        const promise = bookingsService.updateBooking(bookingId, roomId, userId);

        expect(promise).rejects.toEqual({
            name: 'ForbiddenError',
            message: 'Not authorized to access this resource!',
        })
    })
})

describe("get booking", () => {
    it ("Should throw an error when user doesn't have booking", async () => {
        const userId = 1;
        jest.spyOn(bookingsRepository, "findBookingWithRoomData").mockResolvedValue(undefined);
        const promise = bookingsService.getBooking(userId);

        expect(promise).rejects.toEqual({
            name: 'NotFoundError',
            message: 'No result for this search!',
        })
    })
})