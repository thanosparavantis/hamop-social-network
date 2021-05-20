import {useCallback, useContext, useEffect, useState} from "react";
import firebase from "firebase";
import AppCacheContext from "../AppCacheContext";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleNotch} from "@fortawesome/free-solid-svg-icons";
import {Link} from "react-router-dom";
import TimeAgo from "timeago-react";
import {faCheckCircle, faTrashAlt} from "@fortawesome/free-regular-svg-icons";
import UserContext from "../UserContext";

function Comment({postId, commentId, className = null}) {
  const appCache = useContext(AppCacheContext)
  const user = useContext(UserContext)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState()
  const [author, setAuthor] = useState()
  const [authorUsername, setAuthorUsername] = useState()
  const [authorDisplayName, setAuthorDisplayName] = useState()
  const [authorPhotoURL, setAuthorPhotoURL] = useState()
  const [content, setContent] = useState()
  const [creationDate, setCreationDate] = useState()
  const [confirmDelete, setConfirmDelete] = useState(false)

  useEffect(() => {
    if (appCache.isCached(commentId)) {
      const comment = appCache.getItem(commentId)
      setAuthor(comment.author)
      setContent(comment.content)
      setCreationDate(new Date(comment.creationDate))
    } else {
      firebase.firestore()
        .collection("comments")
        .doc(commentId)
        .get()
        .then(doc => {
          const data = doc.data()
          if (!data) {
            setError({message: "Δεν φαίνεται να υπάρχει αυτό το σχόλιο."})
            return
          }

          setAuthor(data.author)
          setContent(data.content)
          setCreationDate(data.creationDate.toDate())

          const commentObj = {
            author: data.author,
            content: data.content,
            creationDate: data.creationDate.toDate()
          }

          appCache.addItem(commentId, commentObj)
        })
        .catch(error => setError(error))
    }
  }, [commentId, appCache])

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

  const handleDeleteClick = useCallback(() => {
    setConfirmDelete(true)
  }, [])

  const deleteComment = useCallback(() => {
    firebase.firestore()
      .collection("comments")
      .doc(commentId)
      .delete()
      .catch(error => setError(error))
  }, [commentId])

  if (error) {
    return (
      <div
        className={`whitespace-pre-line break-words bg-gray-100 p-5 shadow border-t text-red-600 text-center ${className}`}>
        {error.code && (
          <div className="font-bold">
            {error.code}
          </div>
        )}

        <div>
          {error.message}
        </div>
      </div>
    )
  } else if (loading) {
    return (
      <div className={`bg-gray-100 p-5 shadow border-t text-center font-bold text-gray-600 ${className}`}>
        <FontAwesomeIcon icon={faCircleNotch} spin={true} size="lg" className="mr-3"/>
      </div>
    )
  } else {
    return (
      <div className="px-5 py-3 bg-gray-100 shadow border-t">
        <div className="flex items-center flex-shrink-0">
          <Link to={`/${authorUsername}`} className="block hover:opacity-80">
            <img src={authorPhotoURL} alt={authorUsername} className="h-10 rounded shadow-lg border"/>
          </Link>
          <div className="ml-3 flex flex-col text-sm">
            <Link to={`/${authorUsername}`} className="block font-bold leading-none text-gray-900 hover:underline">
              {authorDisplayName}
            </Link>
            <div className="block text-gray-600">
              <TimeAgo datetime={creationDate} locale="el"/>
            </div>
          </div>
        </div>
        <div className="mt-2 text-sm whitespace-pre-line break-words text-gray-900">
          {content}
        </div>

        {author === user.uid && (
          <div className="flex items-center justify-end">
            <button className={`px-3 py-2 rounded shadow
                    ${confirmDelete ? "bg-red-500 text-white" : "bg-white text-gray-600 hover:text-gray-900"}`}
                    title="Πατήστε εδώ για να διαγράψετε το σχόλιο"
                    onClick={confirmDelete ? deleteComment : handleDeleteClick}>
              {confirmDelete ? (
                <FontAwesomeIcon icon={faCheckCircle}/>
              ) : (
                <FontAwesomeIcon icon={faTrashAlt}/>
              )}
            </button>
          </div>
        )}

      </div>
    )
  }
}

export default Comment