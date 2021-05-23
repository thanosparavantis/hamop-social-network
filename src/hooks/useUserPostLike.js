import {useCallback, useContext, useEffect, useMemo, useState} from "react";
import firebase from "firebase/app";
import AppCacheContext from "../context/AppCacheContext";

function useUserPostLike(userId, postId) {
  const appCache = useContext(AppCacheContext)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [hasLiked, setHasLiked] = useState()
  const cacheKey = useMemo(() => {
    return `UserPostLike-${userId}-${postId}`
  }, [userId, postId])

  const getFrom = useCallback((likeObj) => {
    setHasLiked(likeObj.hasLiked)
  }, [])

  const getCached = useCallback(() => {
    if (appCache.isCached(cacheKey)) {
      getFrom(appCache.getItem(cacheKey))
    }
  }, [cacheKey, appCache, getFrom])

  const like = useCallback(() => {
    appCache.addItem(cacheKey, {hasLiked: true}, false)

    firebase.firestore()
      .collection("likes")
      .add({
        user: userId,
        post: postId,
      })
      .catch(error => {
        setError(true)
        console.error(error)
      })
  }, [appCache, cacheKey, postId, userId])

  const unlike = useCallback(() => {
    appCache.addItem(cacheKey, {hasLiked: false}, false)

    firebase.firestore()
      .collection("likes")
      .where("user", "==", userId)
      .where("post", "==", postId)
      .get()
      .then(querySnapshot => {
        if (querySnapshot.empty) {
          return
        }
        return querySnapshot.docs[0].ref.delete()
      })
      .catch(error => {
        setError(true)
        console.error(error)
      })
  }, [appCache, cacheKey, postId, userId])

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

    const likeObj = {
      hasLiked: undefined
    }

    appCache.addItem(cacheKey, likeObj, false)

    firebase.firestore()
      .collection("likes")
      .where("user", "==", userId)
      .where("post", "==", postId)
      .get()
      .then(querySnapshot => {
        console.debug(`Fetch user post like.`)

        if (querySnapshot.empty) {
          setHasLiked(false)
          likeObj["hasLiked"] = false
        } else {
          setHasLiked(true)
          likeObj["hasLiked"] = true
        }

        appCache.addItem(cacheKey, likeObj, false)
      })
      .catch(error => {
        setError(true)
        console.error(error)
      })
  }, [userId, postId, cacheKey, appCache])

  useEffect(() => {
    if (hasLiked !== undefined) {
      setLoading(false)
    }
  }, [hasLiked])

  return [
    like,
    unlike,
    hasLiked,
    loading,
    error
  ]
}

export default useUserPostLike