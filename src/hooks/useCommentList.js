import firebase from "firebase/app";
import {useCallback, useRef, useState} from "react";

function useCommentList(postId) {
  const [error, setError] = useState(false)
  const [commentIds, setCommentIds] = useState([])
  const [limit, setLimit] = useState(10)
  const [hasMore, setHasMore] = useState(false)
  const commentCallback = useRef()

  const stop = useCallback(() => {
    if (commentCallback.current) {
      commentCallback.current()
      commentCallback.current = null
    }
  }, [])

  const start = useCallback(() => {
    if (!postId) {
      return
    }

    stop()

    const unsubscribe = firebase.firestore()
      .collection("comments")
      .where("post", "==", postId)
      .orderBy("creationDate", "asc")
      .limit(limit)
      .onSnapshot(querySnapshot => {
        console.debug("Updating comments.")

        const docSize = querySnapshot.docs.length
        setHasMore(docSize >= limit)

        setCommentIds(querySnapshot.docs.map(doc => {
          return doc.id
        }))
      }, error => {
        setError(true)
        console.error(error)
      })

    commentCallback.current = () => {
      console.debug("Unsubscribing from comments.")
      unsubscribe()
    }
  }, [postId, stop, limit])

  const loadMore = useCallback(() => {
    setLimit(oldLimit => oldLimit + 10)
  }, [])

  return [
    commentIds,
    start,
    stop,
    loadMore,
    hasMore,
    error,
  ]
}

export default useCommentList