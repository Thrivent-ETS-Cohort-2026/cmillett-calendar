import { useState } from "react"
import { fetchUsers } from "../service/UserService";
import type { User } from "../types/ExternalTypes";
import type { LoginProps } from "../types/PropTypes";


export default function Login({ setUserCallback }: LoginProps) {
    
    const [emailState, setEmailState] = useState<string>("");
    const [passState, setPassState] = useState<string>("");

    async function tryLogin() {
        const externalUsers: User[] = await fetchUsers();
        const userFound: User | undefined = externalUsers.find((user) => user.email === emailState && user.password === passState)

        if (userFound) {
            setUserCallback(userFound);
        } else alert("Incorrect email and/or password.");
    }

    return (
        <div className="bg-prime/70 w-1/3 border-third border-2 rounded-2xl p-4 flex flex-col items-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <h2 className="text-2xl font-bold mb-2">Welcome Back</h2>

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
                onClick={() => tryLogin()}
            >
                Login
            </button>
        </div>
    )
}