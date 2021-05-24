import firebase from "firebase/app";
import {useCallback, useRef, useState} from "react";

function usePostTopicList(topic) {
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
    stop()

    const unsubscribe = firebase.firestore()
      .collection("posts")
      .where("topic", "==", topic.id === "home" ? null : topic.id)
      .orderBy("creationDate", "desc")
      .limit(limit)
      .onSnapshot(querySnapshot => {
        console.debug("Fetch topic posts feed.")

        const docSize = querySnapshot.docs.length
        setHasMore(docSize >= limit)

        setPostIds(querySnapshot.docs.map(doc => doc.id))
      }, error => {
        setError(true)
        console.error(error)
      })

    callback.current = () => {
      console.debug("Unsubscribe from topic posts feed.")
      unsubscribe()
    }
  }, [stop, limit, topic])

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

export default usePostTopicList