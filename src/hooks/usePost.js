import {useCallback, useContext, useEffect, useMemo, useState} from "react";
import firebase from "firebase/app";
import AppCacheContext from "../context/AppCacheContext";

function usePost(postId) {
  const appCache = useContext(AppCacheContext)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [found, setFound] = useState(true)
  const [author, setAuthor] = useState()
  const [content, setContent] = useState()
  const [creationDate, setCreationDate] = useState()
  const cacheKey = useMemo(() => {
    return `Post-${postId}`
  }, [postId])

  const getFrom = useCallback(postObj => {
    setAuthor(postObj.author)
    setContent(postObj.content)
    setCreationDate(new Date(postObj.creationDate))
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

  const deletePost = useCallback(() => {
    firebase.firestore()
      .collection("posts")
      .doc(postId)
      .delete()
      .catch(error => {
        setError(true)
        console.error(error)
      })
  }, [postId])

  useEffect(() => {
    if (!postId || appCache.isCached(cacheKey)) {
      return
    }

    const postObj = {
      id: postId,
      author: undefined,
      content: undefined,
      creationDate: undefined
    }

    appCache.addItem(cacheKey, postObj, false)

    firebase.firestore()
      .collection("posts")
      .doc(postId)
      .get()
      .then(doc => {
        console.debug(`Fetch post.`)
        const data = doc.data()

        if (!data) {
          setFound(false)
          throw new Error("Post record does not exist.")
        }

        const author = data.author
        const content = data.content
        const creationDate = data.creationDate.toDate()
        setAuthor(author)
        postObj["author"] = author
        setContent(content)
        postObj["content"] = content
        setCreationDate(creationDate)
        postObj["creationDate"] = creationDate

        appCache.addItem(cacheKey, postObj, false)
      }).catch(error => {
      setError(true)
      console.error(error)
    })
  }, [postId, cacheKey, appCache])

  useEffect(() => {
    if (author !== undefined && content !== undefined && creationDate !== undefined
    ) {
      setLoading(false)
    }
  }, [author, content, creationDate])

  return [
    {
      id: postId,
      author: author,
      content: content,
      creationDate: creationDate,
    },
    deletePost,
    loading,
    error,
    found,
  ]
}

export default usePost