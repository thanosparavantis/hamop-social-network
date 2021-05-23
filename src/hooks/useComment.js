import {useCallback, useContext, useEffect, useMemo, useState} from "react";
import firebase from "firebase/app";
import AppCacheContext from "../context/AppCacheContext";

function useComment(commentId) {
  const appCache = useContext(AppCacheContext)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [author, setAuthor] = useState()
  const [content, setContent] = useState()
  const [creationDate, setCreationDate] = useState()
  const cacheKey = useMemo(() => {
    return `Comment-${commentId}`
  }, [commentId])

  const getFrom = useCallback(commentObj => {
    setAuthor(commentObj.author)
    setContent(commentObj.content)
    setCreationDate(new Date(commentObj.creationDate))
  }, [])

  const getCached = useCallback(() => {
    if (appCache.isCached(cacheKey)) {
      getFrom(appCache.getItem(cacheKey))
    }
  }, [cacheKey, appCache, getFrom])

  useEffect(() => {
    if (!commentId) {
      return
    }

    getCached()

    appCache.addListener(cacheKey, getFrom)

    return () => {
      appCache.removeListener(cacheKey, getFrom)
    }
  }, [commentId, cacheKey, getCached, appCache, getFrom])

  const deleteComment = useCallback(() => {
    firebase.firestore()
      .collection("comments")
      .doc(commentId)
      .delete()
      .catch(error => {
        setError(true)
        console.error(error)
      })
  }, [commentId])

  useEffect(() => {
    if (!commentId || appCache.isCached(cacheKey)) {
      return
    }

    const commentObj = {
      id: commentId,
      author: undefined,
      content: undefined,
      creationDate: undefined
    }

    appCache.addItem(cacheKey, commentObj, false)

    firebase.firestore()
      .collection("comments")
      .doc(commentId)
      .get()
      .then(doc => {
        console.debug(`Fetch comment.`)
        const data = doc.data()

        if (!data) {
          setError(true)
          throw new Error("Comment record does not exist.")
        }

        const author = data.author
        const content = data.content
        const creationDate = data.creationDate.toDate()
        setAuthor(author)
        commentObj["author"] = author
        setContent(content)
        commentObj["content"] = content
        setCreationDate(creationDate)
        commentObj["creationDate"] = creationDate
        appCache.addItem(cacheKey, commentObj, false)
      })
      .catch(error => {
        setError(true)
        console.error(error)
      })
  }, [commentId, cacheKey, appCache])

  useEffect(() => {
    if (author !== undefined && content !== undefined && creationDate !== undefined
    ) {
      setLoading(false)
    }
  }, [author, content, creationDate])

  return [
    {
      author: author,
      content: content,
      creationDate: creationDate,
    },
    deleteComment,
    loading,
    error,
  ]
}

export default useComment