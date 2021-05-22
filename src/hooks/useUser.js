import {useContext, useEffect, useState} from "react";
import firebase from "firebase/app";
import AppCacheContext from "../context/AppCacheContext";

function useUser(userId) {
  const appCache = useContext(AppCacheContext)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [username, setUsername] = useState()
  const [displayName, setDisplayName] = useState()
  const [photoURL, setPhotoURL] = useState()
  const [postCount, setPostCount] = useState()
  const [commentCount, setCommentCount] = useState()
  const [creationDate, setCreationDate] = useState()

  useEffect(() => {
    if (appCache.isCached(userId)) {
      const user = appCache.getItem(userId)
      setUsername(user.username)
      setDisplayName(user.displayName)
      setPhotoURL(user.photoURL)
      setPostCount(user.postCount)
      setCommentCount(user.commentCount)
      setCreationDate(new Date(user.creationDate))
    }
  }, [userId, appCache])

  useEffect(() => {
    if (!appCache.isCached(userId)
      && username !== undefined
      && displayName !== undefined
      && photoURL !== undefined
      && postCount !== undefined
      && commentCount !== undefined
      && creationDate !== undefined
    ) {
      appCache.addItem(userId, {
        uid: userId,
        username: username,
        displayName: displayName,
        photoURL: photoURL,
        postCount: postCount,
        commentCount: commentCount,
        creationDate: creationDate
      })
    }
  }, [userId, appCache, username, displayName, photoURL, postCount, commentCount, creationDate])

  useEffect(() => {
    if (!userId || appCache.isCached(userId)) {
      return
    }

    firebase.firestore()
      .collection("users")
      .doc(userId)
      .get()
      .then(doc => {
        console.debug(`Fetch user: ${userId}`)
        const data = doc.data()

        if (!data) {
          setError(true)
          console.error("User record does not exist.")
          return
        }

        setUsername(data.username)
        setDisplayName(data.displayName)
        setPhotoURL(data.photoURL)
        setCreationDate(data.creationDate.toDate())
      })
      .catch(error => {
        setError(true)
        console.error(error)
      })
  }, [userId, appCache])

  useEffect(() => {
    if (!userId || appCache.isCached(userId)) {
      return
    }

    firebase.firestore()
      .collection("posts")
      .where("author", "==", userId)
      .get()
      .then(querySnapshot => {
        console.debug(`Fetch user post count: ${userId}`)
        setPostCount(querySnapshot.size)
      })
      .catch(error => {
        setError(true)
        console.error(error)
      })
  }, [userId, appCache])

  useEffect(() => {
    if (!userId || appCache.isCached(userId)) {
      return
    }

    firebase.firestore()
      .collection("comments")
      .where("author", "==", userId)
      .get()
      .then(querySnapshot => {
        console.debug(`Fetch user comment count: ${userId}`)
        setCommentCount(querySnapshot.size)
      })
      .catch(error => {
        setError(true)
        console.error(error)
      })
  }, [userId, appCache])

  useEffect(() => {
    if (username !== undefined
      && displayName !== undefined
      && photoURL !== undefined
      && postCount !== undefined
      && commentCount !== undefined
      && creationDate !== undefined) {
      setLoading(false)
    }
  }, [username, displayName, photoURL, postCount, commentCount, creationDate])

  return [
    {
      uid: userId,
      username: username,
      displayName: displayName,
      photoURL: photoURL,
      postCount: postCount,
      commentCount: commentCount,
      creationDate: creationDate,
    },
    loading,
    error,
  ]
}

export default useUser