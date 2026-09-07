
export type DateFormat = {
    year: number,
    month: number,
    day: number
};

export type HourFormat = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
export type MinuteFormat = 0 | 15 | 30 | 45;
export type SuffixFormat = "AM" | "PM";

export type TimeFormat = {
    hour: HourFormat,
    minute: MinuteFormat,
    suffix: SuffixFormat
};

export type Months = [
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
];

export type Days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
]

export type DaysShort = [
    "S",
    "M",
    "Tu",
    "W",
    "Th",
    "F",
    "S"
];