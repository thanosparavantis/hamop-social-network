import {useEffect, useState} from "react";
import firebase from "firebase/app";
import useUser from "./useUser";

function useUserFromUsername(username) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [found, setFound] = useState(true)
  const [uid, setUID] = useState()
  const [user, userLoading, userError] = useUser(uid)

  useEffect(() => {
    if (!username) {
      return
    }

    firebase.firestore()
      .collection("users")
      .where("username", "==", username)
      .get()
      .then(docs => {
        console.log(`Fetch user id from username.`)
        if (docs.empty) {
          setFound(false)
          throw new Error("User record does not exist.")
        }

        setUID(docs.docs[0].id)
      })
      .catch(error => {
        setError(true)
        console.error(error)
      })
  }, [username])

  useEffect(() => {
    if (uid !== undefined) {
      setLoading(false)
    }
  }, [uid])

  return [
    user,
    found,
    loading && userLoading,
    error && userError,
  ]
}

export default useUserFromUsername