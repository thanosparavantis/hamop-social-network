import {useContext, useEffect, useState} from "react";
import firebase from "firebase/app";
import AppCacheContext from "../context/AppCacheContext";

function usePost(postId) {
  const appCache = useContext(AppCacheContext)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [found, setFound] = useState(true)
  const [author, setAuthor] = useState()
  const [content, setContent] = useState()
  const [commentCount, setCommentCount] = useState()
  const [creationDate, setCreationDate] = useState()

  useEffect(() => {
    if (appCache.isCached(postId)) {
      const post = appCache.getItem(postId)
      setAuthor(post.author)
      setContent(post.content)
      setCommentCount(post.commentCount)
      setCreationDate(new Date(post.creationDate))
    }
  }, [postId, appCache])

  useEffect(() => {
    if (!appCache.isCached(postId)
      && author !== undefined
      && content !== undefined
      && commentCount !== undefined
      && creationDate !== undefined
    ) {
      appCache.addItem(postId, {
        id: postId,
        author: author,
        content: content,
        commentCount: commentCount,
        creationDate: creationDate
      })
    }
  }, [appCache, postId, author, content, commentCount, creationDate])

  useEffect(() => {
    if (postId === undefined || appCache.isCached(postId)) {
      return
    }

    firebase.firestore()
      .collection("posts")
      .doc(postId)
      .get()
      .then(doc => {
        console.debug(`Fetch post: ${postId}`)
        const data = doc.data()

        if (!data) {
          setFound(false)
          console.error("Post record does not exist.")
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
  }, [postId, appCache])

  useEffect(() => {
    if (!postId || appCache.isCached(postId)) {
      return
    }

    firebase.firestore()
      .collection("comments")
      .where("post", "==", postId)
      .get()
      .then(querySnapshot => {
        console.debug(`Fetch post comment count: ${postId}`)
        setCommentCount(querySnapshot.size)
      })
      .catch(error => {
        setError(true)
        console.error(error)
      })
  }, [postId, appCache])

  useEffect(() => {
    if (author !== undefined
      && content !== undefined
      && commentCount !== undefined
      && creationDate !== undefined
    ) {
      setLoading(false)
    }
  }, [author, content, commentCount, creationDate])

  return [
    {
      id: postId,
      author: author,
      content: content,
      commentCount: commentCount,
      creationDate: creationDate,
    },
    loading,
    error,
    found,
  ]
}

export default usePost