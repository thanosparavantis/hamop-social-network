import {useContext, useEffect, useState} from "react";
import firebase from "firebase/app";
import AppCacheContext from "../context/AppCacheContext";

function usePost(postId) {
  const appCache = useContext(AppCacheContext)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [author, setAuthor] = useState()
  const [content, setContent] = useState()
  const [commentCount, setCommentCount] = useState()
  const [creationDate, setCreationDate] = useState()

  useEffect(() => {
    if (!postId) {
      return
    }

    if (appCache.isCached(postId)) {
      const post = appCache.getItem(postId)
      setAuthor(post.author)
      setContent(post.content)
      setCommentCount(post.commentCount)
      setCreationDate(new Date(post.creationDate))
    } else {
      firebase.firestore()
        .collection("posts")
        .doc(postId)
        .get()
        .then(doc => {
          const data = doc.data()

          if (!data) {
            setError(true)
            console.error("Post record does not exist.")
            return
          }

          setAuthor(data.author)
          setContent(data.content)
          setCommentCount(data.commentCount)
          setCreationDate(data.creationDate.toDate())

          const postObj = {
            author: data.author,
            content: data.content,
            commentCount: data.commentCount,
            creationDate: data.creationDate.toDate()
          }

          appCache.addItem(postId, postObj)
        })
        .catch(error => {
          setError(true)
          console.error(error)
        })
    }
  }, [postId, appCache])

  useEffect(() => {
    if (author !== undefined
      && content !== undefined
      && commentCount !== undefined
      && creationDate !== undefined) {
      setLoading(false)
    }
  }, [author, content, commentCount, creationDate])

  return [
    {
      author: author,
      content: content,
      commentCount: commentCount,
      creationDate: creationDate,
    },
    loading,
    error,
  ]
}

export default usePost