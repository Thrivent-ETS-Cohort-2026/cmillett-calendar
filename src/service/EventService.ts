import type { Event } from "../types/ExternalTypes";


export async function fetchEvents(): Promise<Event[]> {
    try {
        const response = await fetch("http://localhost:3000/events");
        if (!response.ok) throw new Error("Failed to fetch Event[]");

        const data: Event[] = await response.json();
        return data;
    } catch (error: any) {
        throw new Error(error);
    }
}