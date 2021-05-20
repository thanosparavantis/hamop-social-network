import {useEffect, useState} from "react";
import firebase from "firebase";

function useUserFromUsername(username) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [found, setFound] = useState(true)
  const [uid, setUID] = useState()
  const [displayName, setDisplayName] = useState()
  const [photoURL, setPhotoURL] = useState()
  const [postCount, setPostCount] = useState()
  const [creationDate, setCreationDate] = useState()

  useEffect(() => {
    if (!username) {
      return
    }

    firebase.firestore()
      .collection("users")
      .where("username", "==", username)
      .get()
      .then(docs => {
        if (docs.size === 0) {
          setFound(false)
        }

        const doc = docs.docs[0]
        const data = doc.data()

        if (!data) {
          setError(true)
          console.error("User record does not exist.")
          return
        }

        setUID(doc.id)
        setDisplayName(data.displayName)
        setPhotoURL(data.photoURL)
        setPostCount(data.postCount)
        setCreationDate(data.creationDate.toDate())
      })
      .catch(error => {
        setError(true)
        console.error(error)
      })
  }, [username])

  useEffect(() => {
    if (uid !== undefined
      && displayName !== undefined
      && photoURL !== undefined
      && postCount !== undefined
      && creationDate !== undefined) {
      setLoading(false)
    }
  }, [uid, displayName, photoURL, postCount, creationDate])

  return [
    {
      uid: uid,
      username: username,
      displayName: displayName,
      photoURL: photoURL,
      postCount: postCount,
      creationDate: creationDate,
    },
    found,
    loading,
    error,
  ]
}

export default useUserFromUsername