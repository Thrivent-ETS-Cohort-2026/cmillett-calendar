import type { Event, Invite, Invitee, User } from "../types/ExternalTypes";
import { addUserToInvite, createInvite, handleEventDelete, handleEventUpdate } from "./EventService";


const userWithId: User = {
    id: 1,
    name: "Test",
    email: "test@mail.com",
    password: "alpine"
};

const eventNoId: Event = {
    title: "Test title",
    date: {
        year: 2026,
        month: 8,
        day: 15
    },
    time: {
        hour: 12,
        minute: 30,
        suffix: "PM"
    },
    location: "Test location",
    description: "Test description",
    createdBy: userWithId
};

const eventWithId: Event = {
    title: "Test title",
    date: {
        year: 2026,
        month: 8,
        day: 15
    },
    time: {
        hour: 12,
        minute: 30,
        suffix: "PM"
    },
    location: "Test location",
    description: "Test description",
    createdBy: userWithId,
    id: 1
};

const inviteNoId: Invite = {
    event: eventWithId,
    invitees: [
        { ...userWithId, status: "pending" }
    ]
}

const inviteWithId: Invite = {
    event: eventWithId,
    invitees: [
        { ...userWithId, status: "pending" }
    ],
    id: 1
}


describe("Event Service", () => {
    test("POST new event to events endpoint", async () => {
        // Arrange
        const testEvent: Event = { ...eventNoId };

        const fetchMock = jest.spyOn(globalThis, "fetch").mockResolvedValue({
            ok: true,
            json: async () => testEvent
        } as Response);

        // Act
        await handleEventUpdate(testEvent);

        // Assert
        expect(fetchMock).toHaveBeenCalledTimes(1);
        expect(fetchMock).toHaveBeenCalledWith(
            "http://localhost:3000/events",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(testEvent)
            }
        );
    });


    test("PATCH existing event to events/invites endpoint", async () => {
        // Arrange
        const testExistingEvent: Event = { ...eventWithId };

        // we need 2 API calls because if the handleEventUpdate() function detects an ID,
        // it calls once for the event update, and once for the invite update.
        const fetchMock = jest.spyOn(globalThis, "fetch").mockResolvedValueOnce({
            ok: true,
            json: async () => testExistingEvent
        } as Response).mockResolvedValueOnce({
            ok: true,
            json: async () => []
        } as Response);

        // Act
        await handleEventUpdate(testExistingEvent);

        // Assert
        expect(fetchMock).toHaveBeenCalledTimes(2);
        expect(fetchMock).toHaveBeenCalledWith(
            `http://localhost:3000/events/${testExistingEvent.id}`,
            {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(testExistingEvent)
            }
        );
        expect(fetchMock).toHaveBeenCalledWith("http://localhost:3000/invites");
    });


    test("DELETE existing event from events/invites endpoint", async () => {
        // Arrange
        const testEventDelete: Event = { ...eventWithId };

        const fetchMock = jest.spyOn(globalThis, "fetch").mockResolvedValueOnce({
            ok: true,
            json: async () => testEventDelete
        } as Response).mockResolvedValueOnce({
            ok: true,
            json: async () => []
        } as Response)

        // Act
        await handleEventDelete(testEventDelete);

        // Assert
        expect(fetchMock).toHaveBeenCalledTimes(2);
        expect(fetchMock).toHaveBeenCalledWith(
            `http://localhost:3000/events/${testEventDelete.id}`,
            {
                method: "DELETE",
                headers: { "Content-Type": "application/json" }
            }
        );
        expect(fetchMock).toHaveBeenCalledWith("http://localhost:3000/invites");
    });


    test("POST new invite with existing event to invites enpoint", async () => {
        // Arrange
        const testEvent: Event = { ...eventWithId };
        const testUser: User = { ...userWithId };
        const testInvite: Invite = { ...inviteNoId };

        const fetchMock = jest.spyOn(globalThis, "fetch").mockResolvedValue({
            ok: true,
            json: async () => testInvite
        } as Response);

        // Act
        await createInvite(testEvent, testUser);

        // Assert
        expect(fetchMock).toHaveBeenCalledTimes(1);
        expect(fetchMock).toHaveBeenCalledWith(
            "http://localhost:3000/invites",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(testInvite)
            }
        );
    });


    test("PATCH existing invite with existing user to invites endpoint", async () => {
        // Arrange
        const testInvite: Invite = {...inviteWithId};

        const testInvitees: Invitee[] = []
        for (let invitee of inviteWithId.invitees) {
            testInvitees.push(invitee);
        };

        const newUser: User = {
            id: 2,
            name: "Test 2",
            email: "test2@mail.com",
            password: "alpine"
        }

        const fetchMock = jest.spyOn(globalThis, "fetch").mockResolvedValue({
            ok: true,
            json: async () => testInvitees
        } as Response);

        // Act
        await addUserToInvite(testInvite, newUser);

        // Assert
        expect(fetchMock).toHaveBeenCalledTimes(1);
        expect(fetchMock).toHaveBeenCalledWith(
            `http://localhost:3000/invites/${testInvite.id}`,
            {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    invitees: [
                        ...testInvitees,
                        {...newUser, status: "pending"}
                    ]
                })
            }
        );
    });


});