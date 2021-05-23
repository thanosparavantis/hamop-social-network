import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faExclamationTriangle} from "@fortawesome/free-solid-svg-icons";
import DeleteButton from "./DeleteButton";
import Comment from "./Comment";
import LoadMore from "./LoadMore";
import CommentEditor from "./CommentEditor";
import usePostCommentList from "../hooks/usePostCommentList";
import {useCallback, useContext, useEffect, useState} from "react";
import UserContext from "../context/UserContext";
import firebase from "firebase/app";
import PostLikeButton from "./PostLikeButton";
import PostCommentButton from "./PostCommentButton";

function PostFooter({post, isExpanded = false}) {
  const authUser = useContext(UserContext)
  const [commentIds, startComments, stopComments, loadMoreComments, hasMoreComments, commentError] = usePostCommentList(post.id)
  const [expanded, setExpanded] = useState(isExpanded)
  const [error, setError] = useState(false)

  const onCommentsOpen = useCallback(() => {
    startComments()
    setExpanded(true)
  }, [startComments])

  const onCommentsClose = useCallback(() => {
    stopComments()
    setExpanded(false)
  }, [stopComments])

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
    return (
      <>
        <div className="shadow px-5 py-2 bg-white border-t flex items-center justify-between">
          <div className="flex items-center">
            <PostLikeButton postId={post.id} className="mr-2"/>
            <PostCommentButton postId={post.id} onOpen={onCommentsOpen} onClose={onCommentsClose} isOpen={expanded}/>
          </div>

          {post.author === authUser.uid && (
            <DeleteButton onConfirm={deletePost} helpText="Πάτησε εδώ για να διαγράψεις τη δημοσίευσή σου"/>
          )}
        </div>
        {expanded && (
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