import GoogleFontLoader from "react-google-font-loader";
import {BrowserRouter as Router, Route, Switch,} from "react-router-dom";
import HomePage from "./HomePage";
import Navigation from "./Navigation";
import {useEffect, useState} from "react";
import firebase from "firebase";
import UserContext from "./UserContext";

function App() {
  const [user, setUser] = useState({
    loggedIn: false,
    logout: logout,
    username: null,
    email: null,
    photo: null,
  })

  function logout() {
    localStorage.removeItem("user")

    firebase.auth().signOut()
      .then(() => {
        setUser({
          ...user,
          loggedIn: false,
          username: null,
          email: null,
          photo: null,
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
        username: parsedUser.username,
        email: parsedUser.email,
        photo: parsedUser.photo,
      })
    } else {
      firebase.auth().getRedirectResult()
        .then(result => {
          if (!result.user) {
            return
          }

          setUser({
            ...user,
            loggedIn: true,
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
          weights: [300, 400, 700],
        }
      ]}/>
      <Router>
        <Navigation/>
        <Switch>
          <Route path="/" exact>
            <HomePage/>
          </Route>
        </Switch>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
