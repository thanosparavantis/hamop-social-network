import TimeAgo from "timeago-react";
import {useCallback, useContext, useEffect, useRef, useState} from "react";
import firebase from "firebase";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleNotch, faExclamationTriangle} from "@fortawesome/free-solid-svg-icons";
import AppCacheContext from "../AppCacheContext";
import {Link} from "react-router-dom";
import UserContext from "../UserContext";
import CommentEditor from "./CommentEditor";
import {faCheckCircle, faTrashAlt} from "@fortawesome/free-regular-svg-icons";
import Comment from "./Comment";

function Post({postId, className = ""}) {
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
  const [comments, setComments] = useState()
  const [timeoutId, setTimeoutId] = useState()
  const [throttled, setThrottled] = useState(false)
  const commentCallback = useRef()
  const [commentsOpen, setCommentsOpen] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

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

  const handleDeleteClick = useCallback(() => {
    setConfirmDelete(true)
  }, [])

  const deletePost = useCallback(() => {
    firebase.firestore()
      .collection("posts")
      .doc(postId)
      .delete()
      .catch(error => setError(error))
  }, [postId])

  const handleCommentClick = useCallback(() => {
    setCommentsOpen(!commentsOpen)

    if (!commentsOpen === false && commentCallback.current) {
      commentCallback.current()
      commentCallback.current = null
    }

    if (throttled) {
      return
    }

    setThrottled(true)

    const unsubscribe = firebase.firestore()
      .collection("comments")
      .where("post", "==", postId)
      .orderBy("creationDate", "desc")
      .onSnapshot(querySnapshot => {
        console.debug(`[Post: ${postId}] Updating comments.`)
        setComments(querySnapshot.docs.map(doc => doc.id))
      }, error => setError(error))

    commentCallback.current = () => {
      console.debug(`[Post: ${postId}] Unsubscribing from comments.`)
      unsubscribe()
    }

    const timeoutId = setTimeout(() => {
      setThrottled(false)
    }, 10000)

    setTimeoutId(timeoutId)
  }, [commentsOpen, throttled, postId])

  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [timeoutId])

  useEffect(() => {
    return () => {
      if (commentCallback.current) {
        commentCallback.current()
      }
    }
  }, [])

  if (error) {
    return (
      <div className={`whitespace-pre-line break-words bg-white p-5 rounded shadow text-red-600 text-center ${className}`}>
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
      <div className={`bg-white p-5 rounded shadow text-center font-bold text-gray-600 ${className}`}>
        <FontAwesomeIcon icon={faCircleNotch} spin={true} size="lg" className="mr-3"/>
      </div>
    )
  } else {
    return (
      <div className={className}>
        <div className={`flex flex-col align-top bg-white p-5 rounded-t shadow`}>
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
          <div className="mt-3 whitespace-pre-line break-words text-gray-900">
            {content}
          </div>
        </div>

        <div className="shadow px-5 py-2 bg-white border-t flex items-center justify-between">
          <button className={`px-3 py-2 text-sm shadow rounded font-bold
                  ${commentsOpen ? "bg-gray-200 text-gray-900" : "bg-gray-100 text-gray-600 hover:text-gray-900"}`}
                  onClick={handleCommentClick}>
            Σχολίασε
          </button>

          {author === user.uid && (
            <div>
              <button className={`px-3 py-2 rounded shadow
                    ${confirmDelete ? "bg-red-500 text-white" : "bg-gray-100 text-gray-600 hover:text-gray-900"}`}
                      title="Πατήστε εδώ για να διαγράψετε την δημοσίευση"
                      onClick={confirmDelete ? deletePost : handleDeleteClick}>
                {confirmDelete ? (
                  <FontAwesomeIcon icon={faCheckCircle}/>
                ) : (
                  <FontAwesomeIcon icon={faTrashAlt}/>
                )}
              </button>
            </div>
          )}
        </div>

        { commentsOpen && (
          <CommentEditor postId={postId}/>
        )}

        {comments && (
          <>
            {comments.map(commentId => <Comment postId={postId} commentId={commentId} key={commentId}/>)}
          </>
        )}
      </div>
    )
  }
}

export default Post