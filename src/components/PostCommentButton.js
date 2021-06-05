import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faComments} from "@fortawesome/free-solid-svg-icons";
import {useCallback, useEffect, useState} from "react";
import usePost from "../hooks/usePost";

function PostCommentButton({postId, onOpen, onClose, isOpen = false, className = null}) {
  const [open, setOpen] = useState(isOpen)
  const [post, , postLoading, ,] = usePost(postId)

  const handleClick = useCallback(() => {
    setOpen(oldOpen => !oldOpen)
  }, [])

  useEffect(() => {
    if (open) {
      onOpen()
    } else {
      onClose()
    }
  }, [open, onClose, onOpen])

  return (
    <div className={className}>
      <button className={`px-3 py-2 text-sm shadow rounded font-bold
              ${open ? "bg-gray-200 text-gray-900" : "bg-gray-100 text-gray-600 hover:text-gray-900"}`}
              onClick={handleClick}
      >
        <FontAwesomeIcon icon={faComments} className="mr-2"/>
        {(postLoading || !post.commentCount) && (
          <>Σχόλια</>
        )}

        {post.commentCount === 1 && (
          <>{post.commentCount} σχόλιο</>
        )}

        {post.commentCount > 1 && (
          <>{post.commentCount} σχόλια</>
        )}
      </button>
    </div>
  )
}

export default PostCommentButton