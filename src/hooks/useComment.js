import {useCallback, useContext, useEffect, useState} from "react";
import firebase from "firebase/app";
import AppCacheContext from "../context/AppCacheContext";
import {comment} from "postcss";

function useComment(commentId) {
  const appCache = useContext(AppCacheContext)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [author, setAuthor] = useState()
  const [content, setContent] = useState()
  const [creationDate, setCreationDate] = useState()

  const getFrom = useCallback(commentObj => {
    setAuthor(commentObj.author)
    setContent(commentObj.content)
    setCreationDate(new Date(commentObj.creationDate))
  }, [])

  const getCached = useCallback(() => {
    if (appCache.isCached(commentId)) {
      getFrom(appCache.getItem(commentId))
    }
  }, [commentId, appCache, getFrom])

  useEffect(() => {
    if (!commentId) {
      return
    }

    getCached()

    appCache.addListener(commentId, getFrom)

    return () => {
      console.log("REMOVE COMMENT LISTENER")
      appCache.removeListener(commentId, getFrom)
    }
  }, [commentId, getCached, appCache, getFrom])

  useEffect(() => {
    if (!commentId || appCache.isCached(commentId)) {
      return
    }

    const commentObj = {
      id: commentId,
      author: undefined,
      content: undefined,
      creationDate: undefined
    }

    appCache.addItem(commentId, commentObj)

    firebase.firestore()
      .collection("comments")
      .doc(commentId)
      .get()
      .then(doc => {
        console.debug(`Fetch comment: ${commentId}`)
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
        appCache.addItem(commentId, commentObj)
      })
      .catch(error => {
        setError(true)
        console.error(error)
      })
  }, [commentId, appCache])

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
    loading,
    error,
  ]
}

export default useComment