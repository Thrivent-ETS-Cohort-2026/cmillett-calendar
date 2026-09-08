import type { Event, Invite, User } from "../types/ExternalTypes";


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

export async function handleEventUpdate(event: Event): Promise<void> {
    if (event.id) {
        try {
            const response = await fetch(`http://localhost:3000/events/${event.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(event)
            });
            if (!response.ok) throw new Error("PATCH response failed!");
        } catch (error: any) {
            throw new Error(error);
        }
    } else if (!event.id) {
        try {
            const response = await fetch("http://localhost:3000/events", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(event)
            });
            if (!response.ok) throw new Error("POST response failed!")
        } catch (error: any) {
            throw new Error(error);
        }
    }
}

export async function handleEventDelete(event: Event): Promise<void> {
    if (event.id) {
        try {
            const response = await fetch(`http://localhost:3000/events/${event.id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" }
            });
            if (!response.ok) throw new Error("DELETE response failed!");
        } catch (error: any) {
            throw new Error(error);
        }
    }
}

export async function fetchInvites(): Promise<Invite[]> {
    try {
        const response = await fetch("http://localhost:3000/invites");
        if (!response.ok) throw new Error("Failed to fetch Invites[]");

        const data: Invite[] = await response.json();
        return data;
    } catch (error: any) {
        throw new Error(error);
    }
}

export async function createInvite(event: Event, invitee: User): Promise<void> {
    try {
        const response = await fetch("http://localhost:3000/invites", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                event: event,
                invitees: [
                    {
                        id: invitee.id,
                        name: invitee.name,
                        email: invitee.email,
                        password: invitee.password,
                        status: "pending"
                    }
                ]
            })
        });
        if (!response.ok) throw new Error("POST response failed in createInvite()");
    } catch (error: any) {
        throw new Error(error);
    }
}

export async function addUserToInvite(invite: Invite, invitee: User) {
    try {
        const response = await fetch(`http://localhost:3000/invites/${invite.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                invitees: [
                    ...invite.invitees,
                    {
                        id: invitee.id,
                        name: invitee.name,
                        email: invitee.email,
                        password: invitee.password,
                        status: "pending"
                    }
                ]
            })
        });
        if (!response.ok) throw new Error("PATCH response failed in addUserToInvite()");
    } catch (error: any) {
        throw new Error(error);
    }
}