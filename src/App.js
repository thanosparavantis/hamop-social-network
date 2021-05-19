import GoogleFontLoader from "react-google-font-loader";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import firebase from "firebase";
import UserContext from "./UserContext";
import LoadingPage from "./pages/LoadingPage";
import HomeGuestPage from "./pages/HomeGuestPage";
import ProfilePage from "./pages/ProfilePage";
import ErrorPage from "./pages/ErrorPage";
import NotFoundPage from "./pages/NotFoundPage";
import CommunityPage from "./pages/CommunityPage";
import HomePage from "./pages/HomePage";
import AppCacheContext from "./AppCacheContext";
import AppCache from "./AppCache";
import AppQueries from "./AppQueries";
import AppQueriesContext from "./AppQueriesContext";
import PostPage from "./pages/PostPage";

function App() {
  const [error, setError] = useState()
  let callback = useRef()

  const appCache = useMemo(() => {
    return new AppCache()
  }, [])

  const appQueries = useMemo(() => {
    return new AppQueries()
  }, [])

  const provider = useMemo(() => {
    return new firebase.auth.GoogleAuthProvider()
  }, []);

  const login = useCallback((event = null) => {
    console.debug("Starting login process.")

    if (event) {
      event.preventDefault()
    }

    firebase.auth()
      .signInWithRedirect(provider)
      .catch((error) => {
        setError(error)
      })
  }, [provider])

  const userDefault = useMemo(() => {
    return {
      login: login,
      logout: null,
      loggedIn: false,
      valid: false,
      uid: null,
      username: null,
      displayName: null,
      email: null,
      photoURL: null,
      creationDate: null
    }
  }, [login])

  const [user, setUser] = useState(userDefault)

  const logout = useCallback((event = null) => {
    console.debug("[App] Starting logout process.")

    if (event) {
      event.preventDefault()
    }

    setUser(userDefault)
    callback.current()
    localStorage.removeItem("userId")

    firebase.auth().signOut()
      .then(() => {
        console.debug("[App] User logged out successfully.")

        setUser(oldUser => ({
          ...oldUser,
          valid: true,
        }))
      })
      .catch((error) => {
        setError(error)
      })
  }, [userDefault])

  const updateUser = useCallback((userId, newUser) => {
    console.debug("[App] Updating user profile.")

    setUser(oldUser => ({
      ...oldUser,
      login: null,
      logout: logout,
      loggedIn: true,
      valid: true,
      uid: userId,
      username: newUser.username,
      displayName: newUser.displayName,
      email: newUser.email,
      photoURL: newUser.photoURL,
      creationDate: newUser.creationDate.toDate()
    }))

    localStorage.setItem("userId", userId)
  }, [logout])

  const setupUserSync = useCallback((userId) => {
    console.debug("[App] Setting up user sync.")

    const unsubscribe = firebase.firestore()
      .collection("users")
      .doc(userId)
      .onSnapshot(doc => {
          const newUser = doc.data()

          if (newUser) {
            updateUser(userId, newUser)
          } else {
            const wasLoggedIn = localStorage.getItem("userId")

            if (wasLoggedIn) {
              logout()
            }
          }
        },
        error => {
          setError(error)
        })

    callback.current = () => {
      console.debug("[App] Unsubscribing from user sync.")
      unsubscribe()
    }
  }, [updateUser, logout])

  useEffect(() => {
    firebase.auth().getRedirectResult()
      .then(result => {

        if (result.user) {
          console.debug("[App] Received user from redirect result.")

          const userId = result.user.uid
          setupUserSync(userId)
        } else {
          const localUserId = localStorage.getItem("userId")
          console.debug(`[App] Local userId: ${localUserId}`)

          if (localUserId && localUserId !== "null") {
            console.debug("[App] Cached user, attempting login.")

            setupUserSync(localUserId)
          } else {
            console.debug("[App] User is not logged in.")

            setUser(oldUser => ({
              ...oldUser,
              valid: true,
            }))
          }
        }
      })
      .catch(error => {
        setError(error)
      })
  }, [setupUserSync])

  useEffect(() => {
    return () => {
      if (callback.current) {
        callback.current()
      }
    }
  }, [])

  return (
    <AppCacheContext.Provider value={appCache}>
      <AppQueriesContext.Provider value={appQueries}>
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
                  {user.loggedIn ? <HomePage/> : <HomeGuestPage/>}
                </Route>
                <Route path="/community" exact>
                  <CommunityPage/>
                </Route>
                <Route path="/post/:postId" exact>
                  <PostPage/>
                </Route>
                <Route path="/:username" exact>
                  <ProfilePage/>
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
      </AppQueriesContext.Provider>
    </AppCacheContext.Provider>
  );
}

export default App;
