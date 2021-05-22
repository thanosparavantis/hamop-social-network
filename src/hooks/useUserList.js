import {useCallback, useEffect, useState} from "react";
import firebase from "firebase/app";

function useUserList() {
  const [error, setError] = useState(false)
  const [userIds, setUserIds] = useState([])
  const [limit, setLimit] = useState(20)
  const [hasMore, setHasMore] = useState(false)

  useEffect(() => {
    firebase.firestore()
      .collection("users")
      .orderBy("postCount", "desc")
      .limit(limit)
      .get()
      .then(querySnapshot => {
        console.debug("Fetch user list.")

        const docSize = querySnapshot.docs.length
        setHasMore(docSize >= limit)

        setUserIds(querySnapshot.docs.map(doc => doc.id))
      })
      .catch(error => {
        setError(true)
        console.error(error)
      })
  }, [limit])

  const loadMore = useCallback(() => {
    setLimit(oldLimit => oldLimit + 20)
  }, [])

  return [
    userIds,
    loadMore,
    hasMore,
    error,
  ]
}

export default useUserList