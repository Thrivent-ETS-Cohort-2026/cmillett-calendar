import type { Event, User } from "./ExternalTypes";
import type { DateFormat } from "./DataTypes";

export interface HeaderProps {
    activeUser: User | undefined;
    activeUserCallback: (user: User | undefined) => void;
    toggleDisplayLoginCallback: (toggle: boolean) => void;
    toggleDisplaySignupCallback: (toggle: boolean) => void;
}

export interface LoginProps {
    setUserCallback: (user: User) => void;
}

export interface SignupProps {
    setUserCallback: (user: User) => void;
}

export interface DashboardProps {
    currentUser: User | undefined;
}

export interface CalDetailsProps {
    getSelectedDate: DateFormat;
    currentUser: User | undefined;
    userEvents: Event[];
}

export interface EventListProps {
    getSelectedDate: DateFormat;
    currentUser: User | undefined;
    userEvents: Event[];
}

export interface CalViewProps {
    currentDate: DateFormat;
    userEvents: Event[];
    getSelectedDate: DateFormat;
    setSelectedDate: (date: DateFormat) => void;
}

export interface DayInfoProps {
    userEvents: Event[];
    thisDate: DateFormat;
}