import {useContext, useEffect, useState} from "react";
import firebase from "firebase/app";
import AppCacheContext from "../context/AppCacheContext";

function useUserList() {
  const appCache = useContext(AppCacheContext)
  const [error, setError] = useState(false)
  const [userIds, setUserIds] = useState([])

  useEffect(() => {
    if (appCache.isCached("user_list")) {
      const userIdsObj = appCache.getItem("user_list")
      setUserIds(userIdsObj.users)
    } else {
      firebase.firestore()
        .collection("users")
        .orderBy("postCount", "desc")
        .limit(100)
        .get()
        .then(querySnapshot => {
          console.debug("Fetching list of users.")
          const fetchedUserIds = querySnapshot.docs.map(doc => doc.id)

          setUserIds(fetchedUserIds)
          const userIdsObj = {
            users: fetchedUserIds
          }

          appCache.addItem("user_list", userIdsObj)
        })
        .catch(error => {
          setError(true)
          console.error(error)
        })
    }
  }, [])

  return [
    userIds,
    error,
  ]
}

export default useUserList