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
    if (!commentId) {
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
          const data = doc.data()

          if (!data) {
            setError(true)
            console.error("Comment record does not exist.")
            return
          }

          setAuthor(data.author)
          setContent(data.content)
          setCreationDate(data.creationDate.toDate())

          const commentObj = {
            author: data.author,
            content: data.content,
            creationDate: data.creationDate.toDate()
          }

          appCache.addItem(commentId, commentObj, "large")
        })
        .catch(error => {
          setError(true)
          console.error(error)
        })
    }
  }, [commentId, appCache])

  useEffect(() => {
    if (author !== undefined
      && content  !== undefined
      && creationDate  !== undefined) {
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