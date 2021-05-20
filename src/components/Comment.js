import {useCallback, useContext, useState} from "react";
import firebase from "firebase";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleNotch} from "@fortawesome/free-solid-svg-icons";
import {Link} from "react-router-dom";
import TimeAgo from "timeago-react";
import {faCheckCircle, faTrashAlt} from "@fortawesome/free-regular-svg-icons";
import UserContext from "../UserContext";
import useComment from "../hooks/useComment";
import useUser from "../hooks/useUser";
import LevelBadge from "./LevelBadge";

function Comment({commentId, className = null}) {
  const authUser = useContext(UserContext)
  const [comment, commentLoading, commentError] = useComment(commentId)
  const [user, userLoading, userError] = useUser(comment.author)
  const [error, setError] = useState()
  const [confirmDelete, setConfirmDelete] = useState(false)

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

  if (error || commentError || userError) {
    return (
      <div className={`whitespace-pre-line break-words bg-gray-100
                       p-5 shadow border-t text-red-600 text-center ${className}`}>
        Δεν μπορέσαμε να επεξεργαστούμε το αίτημά σας.
      </div>
    )
  } else if (commentLoading || userLoading) {
    return (
      <div className={`bg-gray-100 p-5 shadow border-t text-center font-bold text-gray-600 ${className}`}>
        <FontAwesomeIcon icon={faCircleNotch} spin={true} size="lg" className="mr-3"/>
      </div>
    )
  } else {
    return (
      <div className="px-5 py-3 bg-gray-100 shadow border-t">

        <div className="flex items-center justify-between">
          <div className="flex items-center flex-shrink-0">
            <Link to={`/${user.username}`} className="block hover:opacity-80">
              <img src={user.photoURL} alt={user.username} className="h-10 rounded shadow-lg border"/>
            </Link>
            <div className="ml-3 flex flex-col text-sm">
              <Link to={`/${user.username}`} className="block font-bold leading-none text-gray-900 hover:underline">
                {user.displayName}
              </Link>

              <div className="flex items-center mt-1">
                <LevelBadge user={user} className="mr-2"/>
                <TimeAgo datetime={comment.creationDate} className="text-gray-600" locale="el"/>
              </div>
            </div>
          </div>

          {comment.author === authUser.uid && (
            <button className={`px-3 py-2 rounded border
                    ${confirmDelete ? "bg-red-500 text-white" : "bg-white text-gray-600 hover:text-gray-900"}`}
                    title="Πατήστε εδώ για να διαγράψετε το σχόλιο"
                    onClick={confirmDelete ? deleteComment : handleDeleteClick}>
              {confirmDelete ? (
                <FontAwesomeIcon icon={faCheckCircle}/>
              ) : (
                <FontAwesomeIcon icon={faTrashAlt}/>
              )}
            </button>
          )}
        </div>

        <div className="mt-2 text-sm whitespace-pre-line break-words text-gray-900">
          {comment.content}
        </div>
      </div>
    )
  }
}

export default Comment