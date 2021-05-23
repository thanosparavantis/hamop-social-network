import {useCallback, useContext, useEffect, useMemo, useState} from "react";
import firebase from "firebase/app";
import AppCacheContext from "../context/AppCacheContext";

function usePostCommentCount(postId) {
  const appCache = useContext(AppCacheContext)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [count, setCount] = useState()
  const cacheKey = useMemo(() => {
    return `PostCommentCount-${postId}`
  }, [postId])

  const getFrom = useCallback((countObj) => {
    setCount(countObj.count)
  }, [])

  const getCached = useCallback(() => {
    if (appCache.isCached(cacheKey)) {
      getFrom(appCache.getItem(cacheKey))
    }
  }, [cacheKey, appCache, getFrom])

  useEffect(() => {
    if (!postId) {
      return
    }

    getCached()

    appCache.addListener(cacheKey, getFrom)

    return () => {
      appCache.removeListener(cacheKey, getFrom)
    }
  }, [postId, cacheKey, getCached, appCache, getFrom])

  useEffect(() => {
    if (!postId || appCache.isCached(cacheKey)) {
      return
    }

    const countObj = {
      count: undefined
    }

    appCache.addItem(cacheKey, countObj)

    firebase.firestore()
      .collection("comments")
      .where("post", "==", postId)
      .get()
      .then(querySnapshot => {
        console.debug(`Fetch post comment count: ${postId}`)
        const count = querySnapshot.size
        setCount(count)
        countObj["count"] = count
        appCache.addItem(cacheKey, countObj)
      })
      .catch(error => {
        setError(true)
        console.error(error)
      })
  }, [postId, cacheKey, appCache])

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

export default usePostCommentCount