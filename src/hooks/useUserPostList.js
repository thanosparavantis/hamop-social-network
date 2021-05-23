import firebase from "firebase/app";
import {useCallback, useRef, useState} from "react";

function useUserPostList(userId) {
  const [error, setError] = useState(false)
  const [postIds, setPostIds] = useState([])
  const [limit, setLimit] = useState(20)
  const [hasMore, setHasMore] = useState(false)
  const callback = useRef()

  const stop = useCallback(() => {
    if (callback.current) {
      callback.current()
      callback.current = null
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
        console.debug(`Fetch user post list.`)

        const docSize = querySnapshot.docs.length
        setHasMore(docSize >= limit)

        setPostIds(querySnapshot.docs.map(doc => doc.id))
      }, error => {
        setError(true)
        console.error(error)
      })

    callback.current = () => {
      console.debug(`Unsubscribe from user post list.`)
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