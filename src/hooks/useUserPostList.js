import firebase from "firebase/app";
import {useCallback, useRef, useState} from "react";

function useUserPostList(userId) {
  const [error, setError] = useState(false)
  const [postIds, setPostIds] = useState([])
  const postCallback = useRef()

  const start = useCallback(() => {
    if (!userId) {
      return
    }

    const unsubscribe = firebase.firestore()
      .collection("posts")
      .where("author", "==", userId)
      .orderBy("creationDate", "desc")
      .onSnapshot(querySnapshot => {
        console.debug("Updating posts.")
        setPostIds(querySnapshot.docs.map(doc => {
          return doc.id
        }))
      }, error => {
        setError(true)
        console.debug(error)
      })

    postCallback.current = () => {
      console.debug("Unsubscribing from posts.")
      unsubscribe()
    }
  }, [userId])

  const stop = useCallback(() => {
    if (postCallback.current) {
      postCallback.current()
    }
  }, [])

  return [
    postIds,
    start,
    stop,
    error,
  ]
}

export default useUserPostList