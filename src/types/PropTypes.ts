import type { Event, Invite, User } from "./ExternalTypes";
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
    userInvites: Invite[];
    userCreatedInvites: Invite[];
    getStatus: boolean;
    setStatus: (status: boolean) => void;
}

export interface EventListProps {
    getSelectedDate: DateFormat;
    currentUser: User | undefined;
    userEvents: Event[];
    userInvites: Invite[];
    setSelectedEvent: (event: Event) => void;
    setSelectedInvite: (invite: Invite) => void;
}

export interface CalViewProps {
    currentUser: User | undefined;
    currentDate: DateFormat;
    userEvents: Event[];
    userInvites: Invite[];
    getSelectedDate: DateFormat;
    setSelectedDate: (date: DateFormat) => void;
}

export interface DayInfoProps {
    currentUser: User | undefined;
    userEvents: Event[];
    userInvites: Invite[];
    thisDate: DateFormat;
}