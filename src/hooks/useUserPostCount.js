import {useCallback, useContext, useEffect, useMemo, useState} from "react";
import firebase from "firebase/app";
import AppCacheContext from "../context/AppCacheContext";

function useUserPostCount(userId) {
  const appCache = useContext(AppCacheContext)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [count, setCount] = useState()
  const cacheKey = useMemo(() => {
    return `UserPostCount-${userId}`
  }, [userId])

  const getFrom = useCallback((countObj) => {
    setCount(countObj.count)
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

    const countObj = {
      count: undefined
    }

    appCache.addItem(cacheKey, countObj)

    firebase.firestore()
      .collection("posts")
      .where("author", "==", userId)
      .get()
      .then(querySnapshot => {
        console.debug(`Fetch user post count: ${userId}`)
        const count = querySnapshot.size
        setCount(count)
        countObj["count"] = count
        appCache.addItem(cacheKey, countObj)
      })
      .catch(error => {
        setError(true)
        console.error(error)
      })
  }, [userId, cacheKey, appCache])

  useEffect(() => {
    if (count !== undefined) {
      setLoading(false)
    }
  }, [count])

  return [
    count,
    loading,
    error
  ]
}

export default useUserPostCount