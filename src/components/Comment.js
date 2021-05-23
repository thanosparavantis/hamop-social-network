import {useCallback, useContext, useState} from "react";
import firebase from "firebase/app";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleNotch} from "@fortawesome/free-solid-svg-icons";
import {Link} from "react-router-dom";
import TimeAgo from "timeago-react";
import UserContext from "../context/UserContext";
import useComment from "../hooks/useComment";
import useUser from "../hooks/useUser";
import StarsBadge from "./StarsBadge";
import Linkify from "react-linkify";
import DeleteButton from "./DeleteButton";

function Comment({commentId, className = null}) {
  const authUser = useContext(UserContext)
  const [comment, commentLoading, commentError] = useComment(commentId)
  const [user, userLoading, userError] = useUser(comment.author)
  const [error, setError] = useState()

  const deleteComment = useCallback(() => {
    firebase.firestore()
      .collection("comments")
      .doc(commentId)
      .delete()
      .catch(error => setError(error))
  }, [commentId])

  if (error || commentError || userError) {
    return (
      <div className={className}>
        <div className={`whitespace-pre-line break-words bg-gray-100
                       p-5 shadow border-t text-red-600 text-center`}>
          Δεν μπορέσαμε να επεξεργαστούμε το αίτημά σας.
        </div>
      </div>
    )
  } else if (commentLoading || userLoading) {
    return (
      <div className={className}>
        <div className={`bg-gray-100 p-5 shadow border-t text-center font-bold text-gray-600`}>
          <FontAwesomeIcon icon={faCircleNotch} spin={true} size="lg"/>
        </div>
      </div>
    )
  } else {
    return (
      <div className={className}>
        <div className="px-5 py-3 bg-gray-100 shadow border-t">
          <div className="flex items-center justify-between">
            <div className="flex items-center flex-shrink-0">
              <Link to={`/${user.username}`} className="block hover:opacity-80">
                <img src={user.photoURL} alt={user.username} className="w-10 h-10 rounded shadow-lg border"/>
              </Link>
              <div className="ml-3 flex flex-col text-sm">
                <Link to={`/${user.username}`} className="block font-bold leading-none text-gray-900 hover:underline">
                  {user.displayName}
                </Link>

                <div className="flex items-center mt-1">
                  <StarsBadge user={user} className="mr-2"/>
                  <TimeAgo datetime={comment.creationDate} className="text-gray-600" locale="el"/>
                </div>
              </div>
            </div>

            {comment.author === authUser.uid && (
              <DeleteButton onConfirm={deleteComment} helpText="Πάτησε εδώ για να διαγράψεις το σχόλιό σου"/>
            )}
          </div>

          <div className="mt-2 text-sm whitespace-pre-line break-words text-gray-900">
            <Linkify componentDecorator={(decoratedHref, decoratedText, key) => (
              <a target="_blank" rel="noopener noreferrer" href={decoratedHref} key={key}
                 className="text-indigo-600 hover:underline">
                {decoratedText}
              </a>)}>{comment.content}</Linkify>
          </div>
        </div>
      </div>
    )
  }
}

export default Comment