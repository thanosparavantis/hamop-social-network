import firebase from "firebase/app";
import {useCallback, useRef, useState} from "react";

function usePostCommentList(postId) {
  const [error, setError] = useState(false)
  const [commentIds, setCommentIds] = useState([])
  const [limit, setLimit] = useState(10)
  const [hasMore, setHasMore] = useState(false)
  const callback = useRef()

  const stop = useCallback(() => {
    if (callback.current) {
      callback.current()
      callback.current = null
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
        console.debug(`Fetch post comment list: ${postId}`)

        const docSize = querySnapshot.docs.length
        setHasMore(docSize >= limit)

        setCommentIds(querySnapshot.docs.map(doc => {
          return doc.id
        }))
      }, error => {
        setError(true)
        console.error(error)
      })

    callback.current = () => {
      console.debug(`Unsubscribe from post comment list: ${postId}`)
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

export default usePostCommentList