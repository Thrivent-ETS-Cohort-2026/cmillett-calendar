import type { DateFormat, TimeFormat } from "./DataTypes";


export interface User {
    id?: number;
    name: string;
    email: string;
    password: string;
    eventsById: number[];
}

export interface Event {
    id?: number;
    title: string;
    date: DateFormat;
    time: TimeFormat
    location: string;
    description: string;
    createdBy: number;
    invitedTo: number[];
}