import {Link} from "react-router-dom";
import TimeAgo from "timeago-react";
import {useEffect, useRef, useState} from "react";
import firebase from "firebase";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleNotch} from "@fortawesome/free-solid-svg-icons";

function UserCard({userId, size = "normal", className = ""}) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState()
  const [username, setUsername] = useState()
  const [displayName, setDisplayName] = useState()
  const [photoURL, setPhotoURL] = useState()
  const [creationDate, setCreationDate] = useState()
  const userCallback = useRef()

  useEffect(() => {
    const unsubscribe = firebase.firestore()
      .collection("users")
      .doc(userId)
      .onSnapshot(doc => {
        console.debug(`[UserCard: ${userId}] Updating user.`)
        const data = doc.data()
        if (!data) {
          return
        }
        setUsername(data.username)
        setDisplayName(data.displayName)
        setPhotoURL(data.photoURL)
        setCreationDate(data.creationDate.toDate())
      }, error => setError(error))

    userCallback.current = () => {
      console.debug(`[UserCard: ${userId}] Unsubscribing from user updates.`)
      unsubscribe()
    }
  }, [userId])

  useEffect(() => {
    if (username && displayName && photoURL && creationDate) {
      setLoading(false)
    }
  }, [username, displayName, photoURL, creationDate])

  useEffect(() => {
    return () => {
      if (userCallback.current) {
        userCallback.current()
      }
    }
  }, [])

  if (error) {
    return (
      <div className={`bg-white p-3 rounded shadow text-center font-bold text-red-600 ${className}`}>
        {error.code}: {error.message}
      </div>
    )
  } else if (loading) {
    return (
      <div className={`bg-white p-3 rounded shadow text-center font-bold text-gray-600 ${className}`}>
        <FontAwesomeIcon icon={faCircleNotch} spin={true} className="mr-3"/>
        Φόρτωση...
      </div>
    )
  } else {
    if (size === "small") {
      return (
        <Link to={`/${username}`}
              className={`flex items-center bg-white p-3 rounded shadow focus:ring ${className}`}>
          <div>
            <img src={photoURL} alt={username} className="h-12 rounded shadow-lg border"/>
          </div>
          <div className="ml-5 text-gray-600">
            <div className="font-bold">
              {displayName}
            </div>
            <div className="text-xs">
              @{username}
            </div>
          </div>
        </Link>
      )
    } else {
      return (
        <Link to={`/${username}`}
              className={`flex items-center bg-white p-5 rounded shadow focus:ring ${className}`}>
          <div>
            <img src={photoURL} alt={username} className="h-20 rounded shadow-lg border"/>
          </div>
          <div className="ml-5">
            <div className="text-gray-900 font-bold leading-none">
              {displayName}
            </div>
            <div className="text-xs mb-1 text-gray-600">
              @{username}
            </div>
            <p className="text-gray-600">
              Γράφτηκε <TimeAgo datetime={creationDate} locale="el"/>
            </p>
          </div>
        </Link>
      )
    }
  }
}

export default UserCard