import type { DateFormat, TimeFormat } from "./DataTypes";


export interface User {
    id?: number;
    name: string;
    email: string;
    password: string;
}

export interface Invitee extends User {
    status: "pending" | "accepted" | "rejected";
}

export interface Event {
    id?: number;
    title: string;
    date: DateFormat;
    time: TimeFormat
    location: string;
    description: string;
    createdBy: User;
}

export interface Invite {
    event: Event;
    invitees: Invitee[];
    id?: number;
}