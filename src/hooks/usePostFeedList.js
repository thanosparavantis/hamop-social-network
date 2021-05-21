import firebase from "firebase/app";
import {useCallback, useRef, useState} from "react";

function usePostFeedList() {
  const [error, setError] = useState(false)
  const [postIds, setPostIds] = useState([])
  const [limit, setLimit] = useState(20)
  const [hasMore, setHasMore] = useState(false)
  const postCallback = useRef()

  const stop = useCallback(() => {
    if (postCallback.current) {
      postCallback.current()
      postCallback.current = null
    }
  }, [])

  const start = useCallback(() => {
    stop()

    const unsubscribe = firebase.firestore()
      .collection("posts")
      .orderBy("creationDate", "desc")
      .limit(limit)
      .onSnapshot(querySnapshot => {
        console.debug("Updating posts.")

        const docSize = querySnapshot.docs.length
        setHasMore(docSize >= limit)

        setPostIds(querySnapshot.docs.map(doc => doc.id))
      }, error => {
        setError(true)
        console.error(error)
      })

    postCallback.current = () => {
      console.debug("Unsubscribing from posts.")
      unsubscribe()
    }
  }, [stop, limit])

  const loadMore = useCallback(() => {
    setLimit(oldLimit => oldLimit + 20)
  }, [])

  return [
    postIds,
    start,
    stop,
    loadMore,
    hasMore,
    error,
  ]
}

export default usePostFeedList