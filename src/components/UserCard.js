import {Link} from "react-router-dom";
import TimeAgo from "timeago-react";
import {useEffect, useState} from "react";
import firebase from "firebase";

function UserCard({userId, size = "normal", className}) {
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
        console.debug(`[UserCard: ${userId}] Updating user details.`)
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
      console.debug(`[UserCard: ${userId}] Unsubscribing from post updates.`)
      unsubscribe()
    }
  }, [])

  if (size === "small") {
    return (
      <Link to={`/${user.username}`}
            className={`flex items-center bg-white p-3 rounded shadow focus:ring ${className}`}>
        <div>
          <img src={user.photoURL} alt={user.username} className="h-12 rounded shadow-lg border"/>
        </div>
        <div className="ml-5 text-gray-600">
          <div className="font-bold">
            {user.displayName}
          </div>
          <div className="text-xs">
            @{user.username}
          </div>
        </div>
      </Link>
    )
  } else {
    return (
      <Link to={`/${user.username}`}
            className={`flex items-center bg-white p-5 rounded shadow focus:ring ${className}`}>
        <div>
          <img src={user.photoURL} alt={user.username} className="h-20 rounded shadow-lg border"/>
        </div>
        <div className="ml-5">
          <div className="text-gray-900 font-bold leading-none">
            {user.displayName}
          </div>
          <div className="text-xs mb-1 text-gray-600">
            @{user.username}
          </div>
          <p className="text-gray-600">
            Γράφτηκε <TimeAgo datetime={user.creationDate} locale="el"/>
          </p>
        </div>
      </Link>
    )
  }
}

export default UserCard