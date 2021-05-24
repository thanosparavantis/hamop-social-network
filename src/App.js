import GoogleFontLoader from "react-google-font-loader";
import {BrowserRouter as Router} from "react-router-dom";
import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import firebase from "firebase/app";
import UserContext from "./context/UserContext";
import LoadingPage from "./pages/LoadingPage";
import ErrorPage from "./pages/ErrorPage";
import AppCacheContext from "./context/AppCacheContext";
import AppCache from "./AppCache";
import Routes from "./Routes";

function App() {
  const [error, setError] = useState(false)
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
      photoURL: null,
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
      .catch(error => {
        setError(true)
        console.debug(error)
      })
  }, [userDefault])

  const updateUser = useCallback((userId, newUser) => {
    setUser(oldUser => ({
      ...oldUser,
      login: null,
      logout: logout,
      loggedIn: true,
      valid: true,
      uid: userId,
      username: newUser.username,
      displayName: newUser.displayName,
      photoURL: newUser.photoURL,
    }))

    localStorage.setItem("userId", userId)
  }, [logout])

  const setupUserSync = useCallback((userId) => {
    const unsubscribe = firebase.firestore()
      .collection("users")
      .doc(userId)
      .onSnapshot(doc => {
          console.debug("Fetch logged in user.")
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
          setError(true)
          console.error(error)
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
                console.debug("Updating user profile picture.")
                doc.ref.update({
                  photoURL: result.user.photoURL
                }).catch(error => {
                  setError(true)
                  console.error(error)
                })
              }
            })
            .catch(error => {
              setError(true)
              console.error(error)
            })

          setupUserSync(userId)
        } else {
          const localUserId = localStorage.getItem("userId")
          console.debug(`Logged in user id: ${localUserId}`)

          if (localUserId) {
            setupUserSync(localUserId)
          } else {
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
            <Routes/>
          ) : (
            <>
              {error ? <ErrorPage/> : <LoadingPage/>}
            </>
          )}
        </Router>
      </UserContext.Provider>
    </AppCacheContext.Provider>
  );
}

export default App;
