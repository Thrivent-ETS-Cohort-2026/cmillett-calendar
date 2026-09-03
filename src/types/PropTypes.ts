import type { User } from "./ExternalTypes";

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