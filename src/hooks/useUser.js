import {useCallback, useContext, useEffect, useMemo, useState} from "react";
import firebase from "firebase/app";
import AppCacheContext from "../context/AppCacheContext";

function useUser(userId) {
  const appCache = useContext(AppCacheContext)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [username, setUsername] = useState()
  const [displayName, setDisplayName] = useState()
  const [photoURL, setPhotoURL] = useState()
  const [creationDate, setCreationDate] = useState()
  const cacheKey = useMemo(() => {
    return `User-${userId}`
  }, [userId])

  const getFrom = useCallback((userObj) => {
    setUsername(userObj.username)
    setDisplayName(userObj.displayName)
    setPhotoURL(userObj.photoURL)
    setCreationDate(new Date(userObj.creationDate))
  }, [])

  const getCached = useCallback(() => {
    if (appCache.isCached(cacheKey)) {
      getFrom(appCache.getItem(cacheKey))
    }
  }, [cacheKey, appCache, getFrom])

  useEffect(() => {
    if (!userId) {
      return
    }

    getCached()

    appCache.addListener(cacheKey, getFrom)

    return () => {
      appCache.removeListener(cacheKey, getFrom)
    }
  }, [userId, cacheKey, getCached, appCache, getFrom])

  useEffect(() => {
    if (!userId || appCache.isCached(cacheKey)) {
      return
    }

    const userObj = {
      uid: userId,
      username: undefined,
      displayName: undefined,
      photoURL: undefined,
      creationDate: undefined,
    }

    appCache.addItem(cacheKey, userObj, false)

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

        appCache.addItem(cacheKey, userObj, false)
      })
      .catch(error => {
        setError(true)
        console.error(error)
      })
  }, [userId, cacheKey, appCache])

  useEffect(() => {
    if (username !== undefined && displayName !== undefined && photoURL !== undefined && creationDate !== undefined) {
      setLoading(false)
    }
  }, [username, displayName, photoURL, creationDate])

  return [
    {
      uid: userId,
      username: username,
      displayName: displayName,
      photoURL: photoURL,
      creationDate: creationDate,
    },
    loading,
    error,
  ]
}

export default useUser