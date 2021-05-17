import GoogleFontLoader from "react-google-font-loader";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import Navigation from "./Navigation";
import {useEffect, useState} from "react";
import firebase from "firebase";
import UserContext from "./UserContext";
import LoadingPage from "./home/LoadingPage";
import HomePage from "./home/HomePage";
import ErrorPage from "./home/ErrorPage";

function App() {
  const [user, setUser] = useState({
    loggedIn: false,
    valid: false,
    login: login,
    logout: logout,
    username: null,
    email: null,
    photo: null,
  })

  const provider = new firebase.auth.GoogleAuthProvider();

  function login() {
    firebase.auth().signInWithRedirect(provider)
  }

  function logout() {
    setUser({
      ...user,
      loggedIn: false,
      valid: false,
      username: null,
      email: null,
      photo: null,
    })

    localStorage.removeItem("user")

    firebase.auth().signOut()
      .then(() => {
        setUser({
          ...user,
          valid: true,
        })
      })
      .catch((error) => {
        console.log(error)
      })
  }

  useEffect(() => {
    if (user.loggedIn) {
      localStorage.setItem("user", JSON.stringify(user))
    }

    const localUser = localStorage.getItem("user")

    if (localUser) {
      if (user.loggedIn || JSON.stringify(user) === localUser) {
        return
      }

      const parsedUser = JSON.parse(localUser)

      setUser({
        ...user,
        loggedIn: parsedUser.loggedIn,
        valid: true,
        username: parsedUser.username,
        email: parsedUser.email,
        photo: parsedUser.photo,
      })
    } else {
      firebase.auth().getRedirectResult()
        .then(result => {
          if (!result.user) {

            if (!user.valid) {
              setUser({
                ...user,
                valid: true,
              })
            }

            return
          }

          setUser({
            ...user,
            loggedIn: true,
            valid: true,
            username: result.user.displayName,
            email: result.user.email,
            photo: result.user.photoURL,
          })
        })
        .catch(error => {
          console.log(error)
        })
    }
  }, [user])

  return (
    <UserContext.Provider value={user}>
      <GoogleFontLoader fonts={[
        {
          font: "Source Sans Pro",
          weights: [300, 400, 600],
        }
      ]}/>
      <Router>
        {user.valid ? (
          <>
            <Navigation/>
            <Switch>
              <Route path="/" exact>
                <HomePage/>
              </Route>
            </Switch>
          </>
        ) : (
          <LoadingPage/>
        )}
      </Router>
    </UserContext.Provider>
  );
}

export default App;
