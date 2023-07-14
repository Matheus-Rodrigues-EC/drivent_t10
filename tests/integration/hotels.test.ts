import supertest from "supertest";
import httpStatus from "http-status";
import * as jwt from 'jsonwebtoken';
import faker from "@faker-js/faker";
import { TicketStatus } from '@prisma/client';
import {    createUser, createTicketType, createTicket, createTicketTypeRemote,
    createEnrollmentWithAddress } from "../factories";
import { createHotel } from '../factories/hotels-factory';
import { cleanDb, generateValidToken } from "../helpers";
import app, {init} from "@/app";
    
beforeAll(async () => {
    await init();
});

beforeEach(async () => {
    await cleanDb();
});


const server = supertest(app);

describe("GET /hotels", () => {
    it("Should respond with 401 if token isn't given", async () =>{
        const res = await server.get('/tickets/types');

        expect(res.statusCode).toBe(httpStatus.UNAUTHORIZED);
    });

    it("Should respond with status 401 if given token isn't valid", async () => {
        const token = faker.lorem.word();
        const res = await server.get('/tickets/types').set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(httpStatus.UNAUTHORIZED);
    });

    it("Should respond with status 401 if there session isn't for given token", async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

        const res = await server.get('/tickets/types').set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(httpStatus.UNAUTHORIZED);
    });

    describe("When the token is valid", () => {
        it("Should respond with status 404 when there aren't hotels created", async () => {
            const token = await generateValidToken();
            const res = await server.get('/hotels/').set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toEqual(httpStatus.NOT_FOUND);
        });

        it("Should respond with status 404 when enrollment doesn't exists", async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
        
            const res = await server.get(`/hotels/`).set('Authorization', `Bearer ${token}`);
        
            expect(res.statusCode).toEqual(httpStatus.NOT_FOUND);
        });

        it("Should respond with status 404 when given ticket doesn't exist", async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            await createEnrollmentWithAddress(user);
        
            const res = await server.get(`/hotels/`).set('Authorization', `Bearer ${token}`);
        
            expect(res.statusCode).toEqual(httpStatus.NOT_FOUND);
        });

        it("Should respond with status 402 when given ticket has not been paid", async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketType();
            await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);

            const res = await server.get(`/hotels`).set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toEqual(httpStatus.PAYMENT_REQUIRED);
        });

        it("Should respond with status 402 when given ticket is remote", async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketTypeRemote();
            await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

            const res = await server.get(`/hotels`).set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toEqual(httpStatus.PAYMENT_REQUIRED);
        });

        it("Should respond with status 402 when given ticket doesn't includes the hotel", async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketTypeRemote();
            await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

            const res = await server.get(`/hotels`).set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toEqual(httpStatus.PAYMENT_REQUIRED);
        });

        it("Should respond with status 200 when enrollment and ticket are valid", async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketType();
            await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

            const res = await server.get(`/hotels`).set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toEqual(httpStatus.OK);
        });

    })
})

describe("GET /hotels/:hotelId", () => {
    it("Should respond with status 401 if token isn't given", async () => {
        const res = await server.get('/tickets/types');

        expect(res.statusCode).toBe(httpStatus.UNAUTHORIZED);
    });
    
    it("Should respond with status 401 if given token isn't valid", async () => {
        const token = faker.lorem.word();
        const res = await server.get('/tickets/types').set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(httpStatus.UNAUTHORIZED);
    });

    it("Should respond with status 401 if there session isn't for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const res = await server.get('/tickets/types').set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(httpStatus.UNAUTHORIZED);
    });

    describe("When the token is valid", () => {
        it("Should respond with status 400 when given hotelId isn't a number", async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketTypeRemote();
            await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
            const hotelId = faker.random.word();
            const res = await server.get(`/hotels/${hotelId}`).set('Authorization', `Bearer ${token}`);
        
            expect(res.statusCode).toEqual(httpStatus.BAD_REQUEST);
        });

        it("Should respond with status 400 when given hotelId isn't given", async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketTypeRemote();
            await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
            const res = await server.get(`/hotels/:hotelId`).set('Authorization', `Bearer ${token}`);
        
            expect(res.statusCode).toEqual(httpStatus.BAD_REQUEST);
        });

        it("Should respond with status 404 when enrollment doesn't exist", async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const hotel = await createHotel();
            const res = await server.get(`/hotels/${hotel.id}`).set('Authorization', `Bearer ${token}`);
        
            expect(res.statusCode).toEqual(httpStatus.NOT_FOUND);
        });
        
        it("Should respond with status 404 when given ticket doesn't exists", async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            await createEnrollmentWithAddress(user);
            const hotel = await createHotel();
        
            const res = await server.get(`/hotels/${hotel.id}`).set('Authorization', `Bearer ${token}`);
        
            expect(res.statusCode).toEqual(httpStatus.NOT_FOUND);
        });

        it("Should respond with status 404 when hotel doesn't exists", async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketType();
            await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
            const hotelId = faker.datatype.number({min: 1000000});
            const res = await server.get(`/hotels/${hotelId}`).set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toEqual(httpStatus.NOT_FOUND);
        });

        it("Should respond with status 402 when given ticket has not been paid", async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketType();
            await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
            const hotel = await createHotel();
        
            const res = await server.get(`/hotels/${hotel.id}`).set('Authorization', `Bearer ${token}`);
        
            expect(res.statusCode).toEqual(httpStatus.PAYMENT_REQUIRED);
        });

        it("Should respond with status 402 when given ticket is remote", async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketTypeRemote();
            await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
            const hotel = await createHotel();
        
            const res = await server.get(`/hotels/${hotel.id}`).set('Authorization', `Bearer ${token}`);
        
            expect(res.statusCode).toEqual(httpStatus.PAYMENT_REQUIRED);
        });

        it("Should respond with status 402 when given ticket doesn't includes the hotel", async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketTypeRemote();
            await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
            const hotel = await createHotel();
        
            const res = await server.get(`/hotels/${hotel.id}`).set('Authorization', `Bearer ${token}`);
        
            expect(res.statusCode).toEqual(httpStatus.PAYMENT_REQUIRED);
        });
    })
})