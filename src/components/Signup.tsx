import { useState } from "react"
import { addUser, fetchUsers } from "../service/UserService";
import type { User } from "../types/ExternalTypes";
import type { SignupProps } from "../types/PropTypes";


export default function Signup({setUserCallback}: SignupProps) {

    const [nameState, setNameState] = useState<string>("");
    const [emailState, setEmailState] = useState<string>("");
    const [passState, setPassState] = useState<string>("");

    async function trySignup() {
        const externalUsers: User[] = await fetchUsers();
        let newUser: User;

        if (externalUsers.find((user) => user.email === emailState)) alert("Email already in use.")

        if (nameState && emailState && passState) {
            newUser = {
                name: nameState,
                email: emailState,
                password: passState,
                eventsById: []
            }
            await addUser(newUser);
            setUserCallback(newUser);
        } else alert("All fields are required.");
    }

    return (
        <div className="bg-prime/70 w-1/3 border-third border-2 rounded-2xl p-4 flex flex-col items-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <h2 className="text-2xl font-bold mb-2">Register</h2>

            <label htmlFor="name">Name</label>
            <input type="text" id="name"
                className="border-prime-text border rounded-2xl w-3/4 px-2 py-1 text-center mb-4"
                value={nameState}
                onChange={(change) => setNameState(change.target.value)}
            />

            <label htmlFor="email">Email</label>
            <input type="email" id="email"
                className="border-prime-text border rounded-2xl w-3/4 px-2 py-1 text-center mb-4"
                value={emailState}
                onChange={(change) => setEmailState(change.target.value)}
            />

            <label htmlFor="password">Password</label>
            <input type="password" id="password"
                className="border-prime-text border rounded-2xl w-3/4 px-2 py-1 text-center mb-4"
                value={passState}
                onChange={(change) => setPassState(change.target.value)}
            />

            <button className="border-third border-2 rounded-2xl bg-secnd px-10 my-2 hover:bg-third"
                onClick={() => trySignup()}
            >
                Sign-up
            </button>
        </div>
    )
}