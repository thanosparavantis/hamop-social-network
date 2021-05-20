import {useContext, useEffect, useState} from "react";
import firebase from "firebase/app";
import AppCacheContext from "../context/AppCacheContext";
import UserContext from "../context/UserContext";

function useUser(userId) {
  const authUser = useContext(UserContext)
  const appCache = useContext(AppCacheContext)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [username, setUsername] = useState()
  const [displayName, setDisplayName] = useState()
  const [photoURL, setPhotoURL] = useState()
  const [postCount, setPostCount] = useState()
  const [creationDate, setCreationDate] = useState()

  useEffect(() => {
    if (!userId) {
      return
    }

    if (userId === authUser.uid) {
      setUsername(authUser.username)
      setDisplayName(authUser.displayName)
      setPhotoURL(authUser.photoURL)
      setPostCount(authUser.postCount)
      setCreationDate(authUser.creationDate)
      return
    }

    if (appCache.isCached(userId)) {
      const user = appCache.getItem(userId)

      setUsername(user.username)
      setDisplayName(user.displayName)
      setPhotoURL(user.photoURL)
      setPostCount(user.postCount)
      setCreationDate(new Date(user.creationDate))
    } else {
      firebase.firestore()
        .collection("users")
        .doc(userId)
        .get()
        .then(doc => {
          const data = doc.data()

          if (!data) {
            setError(true)
            console.error("User record does not exist.")
            return
          }

          setUsername(data.username)
          setDisplayName(data.displayName)
          setPhotoURL(data.photoURL)
          setPostCount(data.postCount)
          setCreationDate(data.creationDate.toDate())

          const userObj = {
            username: data.username,
            displayName: data.displayName,
            photoURL: data.photoURL,
            postCount: data.postCount,
            creationDate: data.creationDate.toDate()
          }

          appCache.addItem(userId, userObj)
        })
        .catch(error => {
          setError(true)
          console.error(error)
        })
    }
  }, [authUser, userId, appCache])

  useEffect(() => {
    if (username !== undefined
      && displayName !== undefined
      && photoURL !== undefined
      && postCount !== undefined
      && creationDate !== undefined) {
      setLoading(false)
    }
  }, [username, displayName, photoURL, postCount, creationDate])

  return [
    {
      uid: userId,
      username: username,
      displayName: displayName,
      photoURL: photoURL,
      postCount: postCount,
      creationDate: creationDate,
    },
    loading,
    error,
  ]
}

export default useUser