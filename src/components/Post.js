import TimeAgo from "timeago-react";
import {useContext, useEffect, useState} from "react";
import firebase from "firebase";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleNotch, faExclamationTriangle} from "@fortawesome/free-solid-svg-icons";
import AppCacheContext from "../AppCacheContext";
import {Link} from "react-router-dom";

function Post({postId, className = ""}) {
  const appCache = useContext(AppCacheContext)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState()
  const [author, setAuthor] = useState()
  const [authorUsername, setAuthorUsername] = useState()
  const [authorDisplayName, setAuthorDisplayName] = useState()
  const [authorPhotoURL, setAuthorPhotoURL] = useState()
  const [content, setContent] = useState()
  const [creationDate, setCreationDate] = useState()

  useEffect(() => {
    if (appCache.isCached(postId)) {
      const post = appCache.getItem(postId)
      setAuthor(post.author)
      setContent(post.content)
      setCreationDate(new Date(post.creationDate))
    } else {
      firebase.firestore()
        .collection("posts")
        .doc(postId)
        .get()
        .then(doc => {
          const data = doc.data()
          if (!data) {
            setError({message: "Δεν φαίνεται να υπάρχει αυτή η δημοσίευση."})
            return
          }

          setAuthor(data.author)
          setContent(data.content)
          setCreationDate(data.creationDate.toDate())

          const postObj = {
            author: data.author,
            content: data.content,
            creationDate: data.creationDate.toDate()
          }

          appCache.addItem(postId, postObj)
        })
        .catch(error => setError(error))
    }
  }, [postId, appCache])

  useEffect(() => {
    if (!author) {
      return
    }

    if (appCache.isCached(author)) {
      const user = appCache.getItem(author)
      setAuthorUsername(user.username)
      setAuthorDisplayName(user.displayName)
      setAuthorPhotoURL(user.photoURL)
    } else {
      firebase.firestore()
        .collection("users")
        .doc(author)
        .get()
        .then(doc => {
          const data = doc.data()
          if (!data) {
            return
          }
          setAuthorUsername(data.username)
          setAuthorDisplayName(data.displayName)
          setAuthorPhotoURL(data.photoURL)

          const userObj = {
            username: data.username,
            displayName: data.displayName,
            photoURL: data.photoURL,
            creationDate: data.creationDate.toDate()
          }

          appCache.addItem(author, userObj)
        })
        .catch(error => setError(error))
    }
  }, [author, postId, appCache])

  useEffect(() => {
    if (author
      && authorUsername
      && authorDisplayName
      && authorPhotoURL
      && content
      && creationDate) {
      setLoading(false)
    }
  }, [author, authorUsername, authorDisplayName, authorPhotoURL, content, creationDate])

  if (error) {
    return (
      <div className={`bg-white p-5 rounded shadow font-bold text-red-600 text-center ${className}`}>
        {error.code && (
          <div>
            {error.code}
          </div>
        )}

        <div>
          <FontAwesomeIcon icon={faExclamationTriangle} className="mr-3"/>
          {error.message}
        </div>
      </div>
    )
  } else if (loading) {
    return (
      <div className={`bg-white p-5 rounded shadow text-center font-bold text-gray-600 ${className}`}>
        <FontAwesomeIcon icon={faCircleNotch} spin={true} size="lg" className="mr-3"/>
      </div>
    )
  } else {
    return (
      <div className={`flex flex-col align-top bg-white p-5 rounded shadow ${className}`}>
        <div className="flex items-center flex-shrink-0">
          <Link to={`/${authorUsername}`} className="block hover:opacity-80">
            <img src={authorPhotoURL} alt={authorUsername} className="h-12 rounded shadow-lg border"/>
          </Link>
          <div className="ml-3 flex flex-col">
            <Link to={`/${authorUsername}`} className="block font-bold leading-none text-gray-900 hover:underline">
              {authorDisplayName}
            </Link>
            <Link to={`/post/${postId}`} className="block mt-1 text-sm text-gray-600 hover:underline">
              <TimeAgo datetime={creationDate} locale="el"/>
            </Link>
          </div>
        </div>
        <div className="mt-3">
          <div className="whitespace-pre-line text-gray-900">
            {content}
          </div>
        </div>
      </div>
    )
  }
}

export default Post