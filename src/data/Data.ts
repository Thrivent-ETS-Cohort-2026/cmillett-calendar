import type { DateFormat, Days, Months } from "../types/DataTypes";

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
        "S",
        "M",
        "Tu",
        "W",
        "Th",
        "F",
        "S"
    ]
}