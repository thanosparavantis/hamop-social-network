import TimeAgo from "timeago-react";
import {useContext, useEffect, useState} from "react";
import firebase from "firebase";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleNotch} from "@fortawesome/free-solid-svg-icons";
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
      <div className={`bg-white px-5 py-3 rounded shadow text-center font-bold text-red-600 ${className}`}>
        {error.code}: {error.message}
      </div>
    )
  } else if (loading) {
    return (
      <div className={`bg-white px-5 py-3 rounded shadow text-center font-bold text-gray-600 ${className}`}>
        <FontAwesomeIcon icon={faCircleNotch} spin={true} className="mr-3"/>
        Φόρτωση...
      </div>
    )
  } else {
    return (
      <div className={`flex flex-col align-top bg-white p-5 rounded shadow ${className}`}>
        <Link to={`/${authorUsername}`} className="flex items-center flex-shrink-0">
          <img src={authorPhotoURL} alt={authorUsername} className="h-12 rounded shadow-lg border"/>
          <div className="ml-3 flex flex-col">
            <div className="font-bold leading-none text-gray-900">
              {authorDisplayName}
            </div>
            <div className="text-sm text-gray-600">
              <TimeAgo datetime={creationDate} locale="el"/>
            </div>
          </div>
        </Link>
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