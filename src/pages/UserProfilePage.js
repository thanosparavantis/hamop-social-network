import {useParams} from "react-router-dom";
import firebase from "firebase";
import {useEffect, useState} from "react";
import LoadingPage from "./LoadingPage";
import Navigation from "../Navigation";
import PageSettings from "../PageSettings";
import ErrorPage from "./ErrorPage";
import NotFoundPage from "./NotFoundPage";

function UserProfilePage() {
  const {username} = useParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState()
  const [notFound, setNotFound] = useState(false)
  const [user, setUser] = useState()

  useEffect(() => {
    const unsubscribe = firebase.firestore()
      .collection("users")
      .where("username", "==", username)
      .onSnapshot(querySnapshot => {
          if (querySnapshot.size > 0) {
            setUser(querySnapshot.docs[0].data())
          } else {
            setNotFound(true)
          }
        },
        error => {
          setError(error)
        })
    return () => {
      unsubscribe()
    }
  }, [username])

  useEffect(() => {
    if (user) {
      setLoading(false)
      setNotFound(false)
    }
  }, [user])

  if (notFound) {
    return <NotFoundPage/>
  } else if (error) {
    return <ErrorPage error={error}/>
  } else if (loading) {
    return <LoadingPage/>
  } else {
    const photo = user.photoURL.replace('s96', 's400')

    return (
      <>
        <PageSettings title={user.username}/>
        <Navigation/>
        <main className="flex items-center justify-center mt-5 mb-10">
          <div className="bg-white shadow rounded p-16">
            <div className="flex items-center justify-center flex-col text-center">
              <img src={photo} alt={user.username} className="h-32 md:h-44 rounded-full shadow-lg"/>
              <h1 className="mt-10 md:text-3xl font-bold">
                {user.displayName}
              </h1>
              <h2 className="mt-1 md:text-xl font-light">
                @{user.username}
              </h2>
            </div>
          </div>
        </main>
      </>
    )

  }
}

export default UserProfilePage