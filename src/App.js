import GoogleFontLoader from "react-google-font-loader";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import {useEffect, useState} from "react";
import firebase from "firebase";
import UserContext from "./UserContext";
import LoadingPage from "./pages/LoadingPage";
import HomePage from "./pages/HomePage";
import UserProfilePage from "./pages/UserProfilePage";
import ErrorPage from "./pages/ErrorPage";
import NotFoundPage from "./pages/NotFoundPage";
import MembersPage from "./pages/MembersPage";
import * as timeago from "timeago.js";
import el from "timeago.js/lib/lang/el";

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
    creationDate: null
  }

  const provider = new firebase.auth.GoogleAuthProvider();

  const [error, setError] = useState()
  const [user, setUser] = useState(userDefault)

  timeago.register("el", el);

  function login(event) {
    event.preventDefault()
    firebase.auth()
      .signInWithRedirect(provider)
      .catch((error) => {
        setError(error)
      })
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
        valid: true,
        loggedIn: parsedUser.loggedIn,
        uid: parsedUser.uid,
        username: parsedUser.username,
        displayName: parsedUser.displayName,
        email: parsedUser.email,
        photoURL: parsedUser.photoURL,
        creationDate: parsedUser.creationDate
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
    if (!user.loggedIn || user.valid) {
      return
    }

    const unsubscribe = firebase.firestore()
      .collection("users")
      .doc(user.uid)
      .onSnapshot(doc => {
          const data = doc.data()

          if (!data) {
            return
          }

          setUser({
            ...user,
            valid: true,
            username: data.username,
            creationDate: data.creationDate.toDate()
          })
        },
        error => {
          setError(error)
        })

    return () => {
      unsubscribe()
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
        {user.valid && !error ? (
          <Switch>
            <Route path="/" exact>
              <HomePage/>
            </Route>
            <Route path="/members" exact>
              <MembersPage/>
            </Route>
            <Route path="/:username" exact>
              <UserProfilePage/>
            </Route>
            <Route path="*">
              <NotFoundPage/>
            </Route>
          </Switch>
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
