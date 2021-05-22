import firebase from "firebase/app";
import {useCallback, useRef, useState} from "react";

function useUserPostList(userId) {
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
    if (!userId) {
      return
    }

    stop()

    const unsubscribe = firebase.firestore()
      .collection("posts")
      .where("author", "==", userId)
      .orderBy("creationDate", "desc")
      .limit(limit)
      .onSnapshot(querySnapshot => {
        console.debug(`Fetch user post list: ${userId}`)

        const docSize = querySnapshot.docs.length
        setHasMore(docSize >= limit)

        setPostIds(querySnapshot.docs.map(doc => doc.id))
      }, error => {
        setError(true)
        console.error(error)
      })

    postCallback.current = () => {
      console.debug(`Unsubscribe from user post list: ${userId}`)
      unsubscribe()
    }
  }, [userId, stop, limit])

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

export default useUserPostList