import type { DateFormat } from "./DataTypes";


export interface User {
    id?: number;
    name: string;
    email: string;
    password: string;
    eventsById: number[];
}

export interface Event {
    id: number;
    date: DateFormat;
    title: string;
    time: string;
    description: string;
    location: string;
    createdBy: number;
    invitedTo: number[];
}