import { useEffect, useState } from "react";

import type { User } from "./types/ExternalTypes";
import type { HeaderProps, LoginProps, SignupProps } from "./types/PropTypes";

import Header from "./components/Header";
import Login from "./components/Login";
import Signup from "./components/Signup";


export default function App() {

  const [currentUser, setCurrentUser] = useState<User | undefined>();

  const [displayLoginToggle, setDisplayLoginToggle] = useState<boolean>(false);
  const [displaySignupToggle, setDisplaySignupToggle] = useState<boolean>(false);


  useEffect(() => {
    setDisplayLoginToggle(false);
    setDisplaySignupToggle(false);
    console.log("change in user");
  }, [currentUser]);

  // props
  const headerProps: HeaderProps = {
    activeUser: currentUser,
    activeUserCallback: (user) => setCurrentUser(user),
    toggleDisplayLoginCallback: (toggle) => setDisplayLoginToggle(toggle),
    toggleDisplaySignupCallback: (toggle) => setDisplaySignupToggle(toggle)
  }

  const loginProps: LoginProps = {
    setUserCallback: (user) => setCurrentUser(user),
  }

  const signupProps: SignupProps = {
    setUserCallback: (user) => setCurrentUser(user)
  }

  function displayDashboard() {
    if (currentUser !== undefined) {
      return (
        <>
          <div className="w-full h-full flex flex-col">
            <Header {...headerProps} />
            <div className="grow flex items-center justify-center">
              <h1>YOU ARE LOGGED IN</h1>
            </div>
          </div>
        </>
      )
    } else {
      return (
        <>
          <div className="w-full h-full flex flex-col">
            <Header {...headerProps} />
            <div className="grow flex items-center justify-center">
              <h1 className="text-9xl text-prime-text/10 font-black">Cal<sup>2</sup></h1>
            </div>
          </div>
        </>
      )
    }
  }

  return (
    <main className="w-screen h-screen">
      {displayDashboard()}
      {displayLoginToggle && <Login {...loginProps} />}
      {displaySignupToggle && <Signup {...signupProps} />}
    </main>
  )
}