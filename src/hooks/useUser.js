import {useCallback, useContext, useEffect, useState} from "react";
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

  const getFrom = useCallback((userObj) => {
    setUsername(userObj.username)
    setDisplayName(userObj.displayName)
    setPhotoURL(userObj.photoURL)
    setPostCount(userObj.postCount)
    setCommentCount(userObj.commentCount)
    setCreationDate(new Date(userObj.creationDate))
  }, [])

  const getCached = useCallback(() => {
    if (appCache.isCached(userId)) {
      getFrom(appCache.getItem(userId))
    }
  }, [userId, appCache, getFrom])

  useEffect(() => {
    getCached()

    appCache.addListener(userId, getFrom)

    return () => {
      appCache.removeListener(userId, getFrom)
    }
  }, [userId, getCached, appCache, getFrom])

  useEffect(() => {
    if (!userId || appCache.isCached(userId)) {
      return
    }

    const userObj = {
      uid: userId,
      username: undefined,
      displayName: undefined,
      photoURL: undefined,
      postCount: undefined,
      commentCount: undefined,
      creationDate: undefined,
    }

    appCache.addItem(userId, userObj)

    firebase.firestore()
      .collection("users")
      .doc(userId)
      .get()
      .then(doc => {
        console.debug(`Fetch user: ${userId}`)
        const data = doc.data()

        if (!data) {
          setError(true)
          throw new Error("User record does not exist.")
        }

        const username = data.username
        const displayName = data.displayName
        const photoURL = data.photoURL
        const creationDate = data.creationDate.toDate()
        setUsername(username)
        userObj["username"] = username
        setDisplayName(displayName)
        userObj["displayName"] = displayName
        setPhotoURL(data.photoURL)
        userObj["photoURL"] = photoURL
        setCreationDate(creationDate)
        userObj["creationDate"] = creationDate

        return firebase.firestore()
          .collection("posts")
          .where("author", "==", userId)
          .get()
      })
      .then(querySnapshot => {
        console.debug(`Fetch user post count: ${userId}`)
        const postCount = querySnapshot.size
        setPostCount(postCount)
        userObj["postCount"] = postCount

        return firebase.firestore()
          .collection("comments")
          .where("author", "==", userId)
          .get()
      })
      .then((querySnapshot) => {
        console.debug(`Fetch user comment count: ${userId}`)
        const commentCount = querySnapshot.size
        setCommentCount(commentCount)
        userObj["commentCount"] = commentCount
        appCache.addItem(userId, userObj)
      })
      .catch(error => {
        setError(true)
        console.error(error)
      })
  }, [userId, appCache])

  useEffect(() => {
    if (username !== undefined && displayName !== undefined && photoURL !== undefined
      && postCount !== undefined && commentCount !== undefined && creationDate !== undefined
    ) {
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