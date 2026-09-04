import type { Event, User } from "./ExternalTypes";

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

export interface CalViewProps {
    userEvents: Event[];
    getSelectedDay: number[];
    setSelectedDay: (date: number[]) => void;
}

export interface DayInfoProps {
    userEvents: Event[];
    year: number;
    month: number;
    day: number;
}