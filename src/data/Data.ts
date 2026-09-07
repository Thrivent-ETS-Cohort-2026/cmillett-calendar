import type { DateFormat, Days, DaysShort, Months } from "../types/DataTypes";
import type { Event, User } from "../types/ExternalTypes";

export function getCurrentDate(): DateFormat {

    const date: Date = new Date;

    const currentDate: DateFormat = {
        year: date.getFullYear(),
        month: date.getMonth(),
        day: date.getDate()
    }

    return currentDate;
}


export function monthList(): Months {
    return [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ]
}

export function dayList(): Days {
    return [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
    ]
}

export function dayListShort(): DaysShort {
    return [
        "S",
        "M",
        "Tu",
        "W",
        "Th",
        "F",
        "S"
    ]
}

export function createEventTemplate(date: DateFormat, user: User): Event {
    const event: Event = {
        title: "",
        date: date,
        time: {
            hour: 12,
            minute: 30,
            suffix: "PM"
        },
        location: "",
        description: "",
        createdBy: user.id!,
        invitedTo: []
    }

    return event;
}