import type { HeaderProps } from "../types/PropTypes";


export default function Header(
    { activeUser, activeUserCallback, toggleDisplayLoginCallback, toggleDisplaySignupCallback }: HeaderProps) {

    function handleLogout() {
        if (confirm("Are you sure you want to logout?")) {
            activeUserCallback(undefined);
        }
    }

    function navContent() {
        if (activeUser) {
            return (
                <>
                    <h2 className="text-2xl align-middle">
                        Welcome, <span className="font-bold">{activeUser.name}</span>
                    </h2>

                    <button className="border-third border-2 rounded-2xl bg-secnd px-10 my-2 hover:bg-third"
                        onClick={() => {}}
                    >
                        Settings
                    </button>
                    <button className="border-third border-2 rounded-2xl bg-secnd px-10 my-2 hover:bg-third"
                        onClick={() => handleLogout()}
                    >
                        Logout
                    </button>
                </>
            )
        } else {
            return (
                <>
                    <button className="border-third border-2 rounded-2xl bg-secnd px-10 my-2 hover:bg-third"
                        onClick={() => {
                            toggleDisplayLoginCallback(true);
                            toggleDisplaySignupCallback(false);
                        }}
                    >
                        Login
                    </button>
                    <button className="border-third border-2 rounded-2xl bg-secnd px-10 my-2 hover:bg-third"
                        onClick={() => {
                            toggleDisplaySignupCallback(true);
                            toggleDisplayLoginCallback(false);
                        }}
                    >
                        Sign-up
                    </button>
                </>
            )
        }
    }

    return (
        <header className="w-full bg-prime p-4 flex justify-between">
            <h1 className="text-6xl font-extrabold">Cal<sup>2</sup></h1>
            <nav className="border-third border-2 rounded-2xl flex w-1/2 justify-around items-center">
                {navContent()}
            </nav>
        </header>
    )
}