import type { Event } from "../types/ExternalTypes";
import { handleEventUpdate } from "./EventService";


describe("Event Service", () => {
    test("POST new event to events endpoint", async () => {
        // Arrange
        const testEvent: Event = {
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
            createdBy: {
                name: "Test",
                email: "test@mail.com",
                password: "alpine",
                id: 1
            }
        };

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


    test("PATCH existing event to events endpoint", async () => {
        // Arrange
        const testExistingEvent: Event = {
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
            createdBy: {
                name: "Test",
                email: "test@mail.com",
                password: "alpine",
                id: 1
            },
            id: 1
        };

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


});