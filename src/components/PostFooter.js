import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faComments, faExclamationTriangle} from "@fortawesome/free-solid-svg-icons";
import DeleteButton from "./DeleteButton";
import Comment from "./Comment";
import LoadMore from "./LoadMore";
import CommentEditor from "./CommentEditor";
import usePostCommentList from "../hooks/usePostCommentList";
import {useCallback, useContext, useEffect, useState} from "react";
import UserContext from "../context/UserContext";
import firebase from "firebase";

function PostFooter({post, expanded = false}) {
  const authUser = useContext(UserContext)
  const [commentIds, startComments, stopComments, loadMoreComments, hasMoreComments, commentError] = usePostCommentList(post.id)
  const [commentsOpen, setCommentsOpen] = useState(expanded)
  const [error, setError] = useState(false)

  const handleCommentClick = useCallback(() => {
    setCommentsOpen(oldCommentsOpen => !oldCommentsOpen)
  }, [])

  useEffect(() => {
    if (commentsOpen) {
      startComments()
    } else {
      stopComments()
    }
  }, [commentsOpen, startComments, stopComments])

  const deletePost = useCallback(() => {
    firebase.firestore()
      .collection("posts")
      .doc(post.id)
      .delete()
      .catch(error => setError(error))
  }, [post])

  useEffect(() => {
    return () => {
      stopComments()
    }
  }, [stopComments])

  if (error || commentError) {
    return (
      <div className="bg-gray-100 font-bold p-5 shadow border-t text-red-600 text-center">
        <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2"/>
        Υπήρξε κάποιο τεχνικό θέμα, παρακαλώ προσπαθήστε αργότερα
      </div>
    )
  } else {
    const commentCount = post.commentCount.toLocaleString("el-GR")
    return (
      <>
        <div className="shadow px-5 py-2 bg-white border-t flex items-center justify-between">
          <button className={`px-3 py-2 text-sm shadow rounded font-bold
                  ${commentsOpen ? "bg-gray-200 text-gray-900" : "bg-gray-100 text-gray-600 hover:text-gray-900"}`}
                  onClick={handleCommentClick}>
            <FontAwesomeIcon icon={faComments} className="mr-2"/>
            {post.commentCount === 0 && (
              <>Σχόλια</>
            )}
            {post.commentCount === 1 && (
              <span>{commentCount} σχόλιο</span>
            )}

            {post.commentCount > 1 && (
              <span>{commentCount} σχόλια</span>
            )}
          </button>

          {post.author === authUser.uid && (
            <DeleteButton onConfirm={deletePost} helpText="Πάτησε εδώ για να διαγράψεις τη δημοσίευσή σου"/>
          )}
        </div>
        {commentsOpen && (
          <div>
            {commentIds.map(
              commentId => <Comment postId={post.id} commentId={commentId} key={commentId}/>
            )}

            {hasMoreComments ? (
              <LoadMore type="secondary" onClick={loadMoreComments}/>
            ) : (
              <CommentEditor postId={post.id}/>
            )}
          </div>
        )}
      </>
    )
  }
}

export default PostFooter