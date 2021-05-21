import firebase from "firebase/app";
import {useCallback, useRef, useState} from "react";

function usePostFeedList() {
  const [error, setError] = useState(false)
  const [postIds, setPostIds] = useState([])
  const postCallback = useRef()

  const start = useCallback(() => {
    const unsubscribe = firebase.firestore()
      .collection("posts")
      .orderBy("creationDate", "desc")
      .limit(20)
      .onSnapshot(querySnapshot => {
        console.debug("Updating posts.")
        setPostIds(querySnapshot.docs.map(doc => {
          return doc.id
        }))
      }, error => {
        setError(true)
        console.error(error)
      })

    postCallback.current = () => {
      console.debug("Unsubscribing from posts.")
      unsubscribe()
    }
  }, [])

  const stop = useCallback(() => {
    if (postCallback.current) {
      postCallback.current()
      postCallback.current = null
    }
  }, [])

  return [
    postIds,
    start,
    stop,
    error,
  ]
}

export default usePostFeedList