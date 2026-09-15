import { useEffect, useState } from "react";

import type { User } from "./types/ExternalTypes";
import type { DashboardProps, HeaderProps, LoginProps, SettingsProps, SignupProps } from "./types/PropTypes";

import Header from "./components/Header";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard/Dashboard";
import Settings from "./components/Settings";


export default function App() {

  // DEV USER, used for testing.
  // const devUser: User = {
  //   id: 0,
  //   name: "Admin",
  //   email: "admin@mail.com",
  //   password: "alpine"
  // }

  const [currentUser, setCurrentUser] = useState<User | undefined>();

  const [displayLoginToggle, setDisplayLoginToggle] = useState<boolean>(false);
  const [displaySignupToggle, setDisplaySignupToggle] = useState<boolean>(false);
  const [displaySettingsToggle, setDisplaySettingsToggle] = useState<boolean>(false);

  useEffect(() => {
    setDisplayLoginToggle(false);
    setDisplaySignupToggle(false);
  }, [currentUser]);

  // props
  const headerProps: HeaderProps = {
    activeUser: currentUser,
    activeUserCallback: (user) => setCurrentUser(user),
    toggleDisplayLoginCallback: (toggle) => setDisplayLoginToggle(toggle),
    toggleDisplaySignupCallback: (toggle) => setDisplaySignupToggle(toggle),
    toggleDisplaySettingsCallback: (toggle) => setDisplaySettingsToggle(toggle),
    displaySettingsToggle: displaySettingsToggle
  }

  const loginProps: LoginProps = {
    setUserCallback: (user) => setCurrentUser(user),
  }

  const signupProps: SignupProps = {
    setUserCallback: (user) => setCurrentUser(user)
  }

  const settingsProps: SettingsProps = {
    currentUser: currentUser
  }

  const dashboardProps: DashboardProps = {
    currentUser: currentUser
  }

  function displayDashboard() {
    if (currentUser) {
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
      {displaySettingsToggle && <Settings {...settingsProps} />}
    </main>
  )
}