import {useCallback, useRef, useState} from "react";
import firebase from "firebase/app";

function usePostLikeCount(postId) {
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

    const unsubscribe = firebase.firestore()
      .collection("likes")
      .where("post", "==", postId)
      .onSnapshot(querySnapshot => {
        console.debug(`Fetch post like count.`)
        setCount(querySnapshot.size)
      }, error => {
        setError(true)
        console.error(error)
      })

    callback.current = () => {
      console.debug(`Unsubscribe from post like count.`)
      unsubscribe()
    }
  }, [postId])

  return [
    count,
    start,
    stop,
    error
  ]
}

export default usePostLikeCount