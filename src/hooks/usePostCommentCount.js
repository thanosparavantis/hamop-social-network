import {useCallback, useRef, useState} from "react";
import firebase from "firebase/app";

function usePostCommentCount(postId) {
  const [error, setError] = useState(false)
  const [count, setCount] = useState()
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
      .onSnapshot(querySnapshot => {
        console.debug(`Fetch post comment count.`)
        setCount(querySnapshot.size)
      }, error => {
        setError(true)
        console.error(error)
      })

    callback.current = () => {
      console.debug(`Unsubscribe from post comment count.`)
      unsubscribe()
    }
  }, [postId, stop])

  return [
    count,
    start,
    stop,
    error
  ]
}

export default usePostCommentCount