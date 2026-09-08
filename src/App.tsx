import { useEffect, useState } from "react";

import type { User } from "./types/ExternalTypes";
import type { DashboardProps, HeaderProps, LoginProps, SignupProps } from "./types/PropTypes";

import Header from "./components/Header";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard/Dashboard";


export default function App() {

  const devUser: User = {
    id: 0,
    name: "DEV",
    email: "dev@dev.com",
    password: "dev"
  }

  const [currentUser, setCurrentUser] = useState<User | undefined>(devUser);

  const [displayLoginToggle, setDisplayLoginToggle] = useState<boolean>(false);
  const [displaySignupToggle, setDisplaySignupToggle] = useState<boolean>(false);


  useEffect(() => {
    setDisplayLoginToggle(false);
    setDisplaySignupToggle(false);
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

  const dashboardProps: DashboardProps = {
    currentUser: currentUser
  }

  function displayDashboard() {
    if (currentUser !== undefined) {
      return (
        <>
          <div className="w-full h-full flex flex-col">
            <Header {...headerProps} />
            <div className="grow flex">
              <Dashboard {...dashboardProps} />
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