import {useContext, useEffect, useState} from "react";
import firebase from "firebase/app";
import AppCacheContext from "../context/AppCacheContext";

function useComment(commentId) {
  const appCache = useContext(AppCacheContext)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [author, setAuthor] = useState()
  const [content, setContent] = useState()
  const [creationDate, setCreationDate] = useState()

  useEffect(() => {
    if (appCache.isCached(commentId)
      && author === undefined
      && content === undefined
      && creationDate === undefined
    ) {
      const post = appCache.getItem(commentId)
      setAuthor(post.author)
      setContent(post.content)
      setCreationDate(new Date(post.creationDate))
    } else if (!appCache.isCached(commentId)
      && author !== undefined
      && content !== undefined
      && creationDate !== undefined
    ) {
      appCache.addItem(commentId, {
        id: commentId,
        author: author,
        content: content,
        creationDate: creationDate
      })
    }
  }, [appCache, commentId, author, content, creationDate])

  useEffect(() => {
    if (!commentId || appCache.isCached(commentId)) {
      return
    }

    if (appCache.isCached(commentId)) {
      const comment = appCache.getItem(commentId)
      setAuthor(comment.author)
      setContent(comment.content)
      setCreationDate(new Date(comment.creationDate))
    } else {
      firebase.firestore()
        .collection("comments")
        .doc(commentId)
        .get()
        .then(doc => {
          console.debug(`Fetch comment: ${commentId}`)
          const data = doc.data()

          if (!data) {
            setError(true)
            console.error("Comment record does not exist.")
            return
          }

          setAuthor(data.author)
          setContent(data.content)
          setCreationDate(data.creationDate.toDate())
        })
        .catch(error => {
          setError(true)
          console.error(error)
        })
    }
  }, [commentId, appCache])

  useEffect(() => {
    if (author !== undefined
      && content !== undefined
      && creationDate !== undefined) {
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