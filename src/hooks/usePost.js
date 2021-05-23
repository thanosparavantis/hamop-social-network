import {useCallback, useContext, useEffect, useState} from "react";
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

  const getFrom = useCallback(postObj => {
    setAuthor(postObj.author)
    setContent(postObj.content)
    setCommentCount(postObj.commentCount)
    setCreationDate(new Date(postObj.creationDate))
  }, [])

  const getCached = useCallback(() => {
    if (appCache.isCached(postId)) {
      getFrom(appCache.getItem(postId))
    }
  }, [postId, appCache, getFrom])

  useEffect(() => {
    getCached()

    appCache.addListener(postId, getFrom)

    return () => {
      appCache.removeListener(postId, getFrom)
    }
  }, [postId, getCached, appCache, getFrom])

  useEffect(() => {
    if (!postId || appCache.isCached(postId)) {
      return
    }

    const postObj = {
      id: postId,
      author: undefined,
      content: undefined,
      commentCount: undefined,
      creationDate: undefined
    }

    appCache.addItem(postId, postObj)

    firebase.firestore()
      .collection("posts")
      .doc(postId)
      .get()
      .then(doc => {
        console.debug(`Fetch post: ${postId}`)
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

        return firebase.firestore()
          .collection("comments")
          .where("post", "==", postId)
          .get()
      })
      .then(querySnapshot => {
        console.debug(`Fetch post comment count: ${postId}`)
        const commentCount = querySnapshot.size
        setCommentCount(commentCount)
        postObj["commentCount"] = commentCount
        appCache.addItem(postId, postObj)
      })
      .catch(error => {
        setError(true)
        console.error(error)
      })
  }, [postId, appCache])

  useEffect(() => {
    if (author !== undefined && content !== undefined
      && commentCount !== undefined && creationDate !== undefined
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