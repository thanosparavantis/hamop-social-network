import TimeAgo from "timeago-react";
import {useCallback, useContext, useEffect, useState} from "react";
import firebase from "firebase/app";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleNotch, faComments} from "@fortawesome/free-solid-svg-icons";
import {Link} from "react-router-dom";
import UserContext from "../context/UserContext";
import CommentEditor from "./CommentEditor";
import {faCheckCircle, faTrashAlt} from "@fortawesome/free-regular-svg-icons";
import usePost from "../hooks/usePost";
import useUser from "../hooks/useUser";
import useCommentList from "../hooks/useCommentList";
import LevelBadge from "./LevelBadge";
import Comment from "./Comment";
import Linkify from 'react-linkify';

function Post({postId, className = ""}) {
  const authUser = useContext(UserContext)
  const [post, postLoading, postError] = usePost(postId)
  const [user, userLoading, userError] = useUser(post.author)
  const [commentIds, startComments, stopComments, commentError] = useCommentList(postId)
  const [error, setError] = useState()
  const [timeoutId, setTimeoutId] = useState()
  const [throttled, setThrottled] = useState(false)
  const [commentsOpen, setCommentsOpen] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

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

    if (!commentsOpen === false) {
      stopComments()
    }

    if (throttled) {
      return
    }

    setThrottled(true)

    startComments()

    const timeoutId = setTimeout(() => {
      setThrottled(false)
    }, 10000)

    setTimeoutId(timeoutId)
  }, [commentsOpen, throttled, startComments, stopComments])

  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [timeoutId])

  useEffect(() => {
    return () => {
      stopComments()
    }
  }, [stopComments])

  if (error || postError || userError || commentError) {
    return (
      <div className={`whitespace-pre-line break-words bg-white font-bold
                       p-5 rounded shadow text-red-600 text-center ${className}`}>
        Δεν μπορέσαμε να επεξεργαστούμε το αίτημά σας.
      </div>
    )
  } else if (postLoading || userLoading) {
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
            <Link to={`/${user.username}`} className="block hover:opacity-80">
              <img src={user.photoURL} alt={user.username} className="h-12 rounded shadow-lg border"/>
            </Link>
            <div className="ml-3 flex flex-col">
              <Link to={`/${user.username}`} className="block font-bold leading-none text-gray-900 hover:underline">
                {user.displayName}
              </Link>

              <div className="flex items-center mt-1">
                <LevelBadge user={user} className="mr-2"/>
                <Link to={`/post/${postId}`} className="block text-sm text-gray-600 hover:underline">
                  <TimeAgo datetime={post.creationDate} locale="el"/>
                </Link>
              </div>
            </div>
          </div>
          <div className="mt-3 whitespace-pre-line break-words text-gray-900">
            <Linkify componentDecorator={(decoratedHref, decoratedText, key) => (
              <a target="_blank" rel="noopener noreferrer" href={decoratedHref} key={key} className="text-indigo-600 hover:underline">
                {decoratedText}
              </a>)}>{post.content}</Linkify>
          </div>
        </div>

        <div className="shadow px-5 py-2 bg-white border-t flex items-center justify-between">
          <button className={`px-3 py-2 text-sm shadow rounded font-bold
                  ${commentsOpen ? "bg-gray-200 text-gray-900" : "bg-gray-100 text-gray-600 hover:text-gray-900"}`}
                  onClick={handleCommentClick}>
            <FontAwesomeIcon icon={faComments} className="mr-2"/>
            Σχόλια {post.commentCount > 0 && (
            <span>({post.commentCount})</span>
          )}
          </button>

          {post.author === authUser.uid && (
            <div>
              <button className={`px-3 py-2 rounded border
                    ${confirmDelete ? "bg-red-500 text-white" : "bg-white text-gray-600 hover:text-gray-900"}`}
                      title="Διαγραφή δημοσίευσης"
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

        {commentsOpen && (
          <>
            <CommentEditor postId={postId}/>
            {commentIds.map(commentId => <Comment postId={postId} commentId={commentId} key={commentId}/>)}
          </>
        )}
      </div>
    )
  }
}

export default Post