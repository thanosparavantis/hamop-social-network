import GoogleFontLoader from "react-google-font-loader";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import {useEffect, useState} from "react";
import firebase from "firebase";
import UserContext from "./UserContext";
import LoadingPage from "./home/LoadingPage";
import HomePage from "./home/HomePage";
import UserProfilePage from "./home/UserProfilePage";
import ErrorPage from "./home/ErrorPage";

function App() {
  const userDefault = {
    loggedIn: false,
    valid: false,
    uid: null,
    login: login,
    logout: logout,
    username: null,
    displayName: null,
    email: null,
    photoURL: null,
  }

  const provider = new firebase.auth.GoogleAuthProvider();

  const [error, setError] = useState()
  const [user, setUser] = useState(userDefault)

  function login(event) {
    event.preventDefault()
    firebase.auth().signInWithRedirect(provider)
  }

  function logout(event) {
    event.preventDefault()

    setUser(userDefault)
    localStorage.removeItem("user")

    firebase.auth().signOut()
      .then(() => {
        setUser({
          ...user,
          valid: true,
        })
      })
      .catch((error) => {
        setError(error)
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
        uid: parsedUser.uid,
        displayName: parsedUser.displayName,
        email: parsedUser.email,
        photoURL: parsedUser.photoURL,
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
            uid: result.user.uid,
            displayName: result.user.displayName,
            email: result.user.email,
            photoURL: result.user.photoURL,
          })
        })
        .catch(error => {
          setError(error)
        })
    }
  }, [user])

  useEffect(() => {
    if (user.loggedIn && !user.valid) {
      const username = createUsername(user.displayName)

      firebase.firestore()
        .collection("users")
        .doc(user.uid)
        .set({
          username: username,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL
        })
        .then(() => {
          setUser({
            ...user,
            valid: true,
            username: username,
          })
        })
        .catch((error) => {
          setError(error)
        })
    }
  }, [user])

  function createUsername(displayName) {
    return displayName.toLowerCase().replace(/[^a-z0-9]/gi,"")
  }

  return (
    <UserContext.Provider value={user}>
      <GoogleFontLoader fonts={[
        {
          font: "Source Sans Pro",
          weights: [300, 400, 600],
        }
      ]}/>
      <Router>
        {user.valid && !error ? (
          <>
            <Switch>
              <Route path="/" exact>
                <HomePage/>
              </Route>
              <Route path="/:username" exact>
                <UserProfilePage/>
              </Route>
            </Switch>
          </>
        ) : (
          <>
            {error ? <ErrorPage error={error}/> : <LoadingPage/>}
          </>
        )}
      </Router>
    </UserContext.Provider>
  );
}

export default App;
