import TimeAgo from "timeago-react";
import {useEffect, useRef, useState} from "react";
import firebase from "firebase";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleNotch} from "@fortawesome/free-solid-svg-icons";

function Post({postId, className = ""}) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState()
  const [author, setAuthor] = useState()
  const [authorUsername, setAuthorUsername] = useState()
  const [authorDisplayName, setAuthorDisplayName] = useState()
  const [authorPhotoURL, setAuthorPhotoURL] = useState()
  const [content, setContent] = useState()
  const [creationDate, setCreationDate] = useState()
  const postCallback = useRef()
  const authorCallback = useRef()

  useEffect(() => {
    const unsubscribe = firebase.firestore()
      .collection("posts")
      .doc(postId)
      .onSnapshot(doc => {
        console.debug(`[Post: ${postId}] Updating post details.`)
        const data = doc.data()
        if (!data) {
          return
        }
        setAuthor(data.author)
        setContent(data.content)
        setCreationDate(data.creationDate.toDate())
      }, error => setError(error))

    postCallback.current = () => {
      console.debug(`[Post: ${postId}] Unsubscribing from post updates.`)
      unsubscribe()
    }
  }, [postId])

  useEffect(() => {
    if (!author) {
      return
    }

    const unsubscribe = firebase.firestore()
      .collection("users")
      .doc(author)
      .onSnapshot(doc => {
        console.debug(`[Post: ${postId}] Updating user details.`)
        const data = doc.data()
        if (!data) {
          return
        }
        setAuthorUsername(data.username)
        setAuthorDisplayName(data.displayName)
        setAuthorPhotoURL(data.photoURL)
      }, error => setError(error))

    authorCallback.current = () => {
      console.debug(`[Post: ${postId}] Unsubscribing from author updates.`)
      unsubscribe()
    }
  }, [author, postId])

  useEffect(() => {
    if (author && authorUsername && authorDisplayName && authorPhotoURL && content && creationDate) {
      setLoading(false)
    }
  }, [author, authorUsername, authorDisplayName, authorPhotoURL, content, creationDate])

  useEffect(() => {
    return () => {
      if (postCallback.current) {
        postCallback.current()
      }

      if (authorCallback.current) {
        authorCallback.current()
      }
    }
  }, [])

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
      <div className="flex">
        <img src={authorPhotoURL} alt={authorUsername} className="h-12 rounded shadow-lg border mr-3"/>
        <div className={`w-full bg-white px-5 py-3 rounded shadow ${className}`}>
          <div className="font-bold leading-none text-gray-900">
            {authorDisplayName}
          </div>
          <div className="whitespace-pre my-3 text-gray-900">
            {content}
          </div>
          <div className="text-sm text-gray-600">
            <TimeAgo datetime={creationDate} locale="el"/>
          </div>
        </div>
      </div>
    )
  }
}

export default Post