import GoogleFontLoader from "react-google-font-loader";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import firebase from "firebase";
import UserContext from "./context/UserContext";
import LoadingPage from "./pages/LoadingPage";
import HomeGuestPage from "./pages/HomeGuestPage";
import ProfilePage from "./pages/ProfilePage";
import ErrorPage from "./pages/ErrorPage";
import NotFoundPage from "./pages/NotFoundPage";
import CommunityPage from "./pages/CommunityPage";
import HomePage from "./pages/HomePage";
import AppCacheContext from "./context/AppCacheContext";
import AppCache from "./AppCache";
import PostPage from "./pages/PostPage";

function App() {
  const [error, setError] = useState()
  let callback = useRef()

  const appCache = useMemo(() => {
    return new AppCache()
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
      postCount: null,
      creationDate: null
    }
  }, [login])

  const [user, setUser] = useState(userDefault)

  const logout = useCallback((event = null) => {
    console.debug("Starting logout process.")

    if (event) {
      event.preventDefault()
    }

    setUser(userDefault)
    callback.current()
    localStorage.removeItem("userId")

    firebase.auth().signOut()
      .then(() => {
        console.debug("User logged out successfully.")

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
    console.debug("Updating user profile.")

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
      postCount: newUser.postCount,
      creationDate: newUser.creationDate.toDate()
    }))

    localStorage.setItem("userId", userId)
  }, [logout])

  const setupUserSync = useCallback((userId) => {
    console.debug("Setting up user sync.")

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
      console.debug("Unsubscribing from user sync.")
      unsubscribe()
    }
  }, [updateUser, logout])

  useEffect(() => {
    firebase.auth().getRedirectResult()
      .then(result => {

        if (result.user) {
          console.debug("Received user from redirect result.")
          const userId = result.user.uid

          firebase.firestore()
            .collection("users")
            .doc(userId)
            .get()
            .then(doc => {
              if (doc.exists) {
                console.debug("Storing updated profile picture from Google.")
                doc.ref.update({
                  photoURL: result.user.photoURL
                }).catch(error => setError(error))
              }
            })
            .catch(error => setError(error))

          setupUserSync(userId)
        } else {
          const localUserId = localStorage.getItem("userId")
          console.debug(`Local userId: ${localUserId}`)

          if (localUserId && localUserId !== "null") {
            console.debug("Cached user, attempting login.")

            setupUserSync(localUserId)
          } else {
            console.debug("User is not logged in.")

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
    </AppCacheContext.Provider>
  );
}

export default App;
