import {Link} from "react-router-dom";
import TimeAgo from "timeago-react";
import {useContext, useEffect, useState} from "react";
import firebase from "firebase";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleNotch} from "@fortawesome/free-solid-svg-icons";
import AppCacheContext from "../AppCacheContext";

function UserCard({userId, size = "normal", className = ""}) {
  const appCache = useContext(AppCacheContext)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState()
  const [username, setUsername] = useState()
  const [displayName, setDisplayName] = useState()
  const [photoURL, setPhotoURL] = useState()
  const [creationDate, setCreationDate] = useState()

  useEffect(() => {
    if (appCache.isCached(userId)) {
      const user = appCache.getItem(userId)

      setUsername(user.username)
      setDisplayName(user.displayName)
      setPhotoURL(user.photoURL)
      setCreationDate(new Date(user.creationDate))
    } else {
      firebase.firestore()
        .collection("users")
        .doc(userId)
        .get()
        .then(doc => {
          const data = doc.data()

          if (!data) {
            return
          }

          setUsername(data.username)
          setDisplayName(data.displayName)
          setPhotoURL(data.photoURL)
          setCreationDate(data.creationDate.toDate())

          const userObj = {
            username: data.username,
            displayName: data.displayName,
            photoURL: data.photoURL,
            creationDate: data.creationDate.toDate()
          }

          appCache.addItem(userId, userObj)
        })
        .catch(error => setError(error))
    }
  }, [userId, appCache])

  useEffect(() => {
    if (username
      && displayName
      && photoURL
      && creationDate) {
      setLoading(false)
    }
  }, [username, displayName, photoURL, creationDate])

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