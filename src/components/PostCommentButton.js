import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faComments} from "@fortawesome/free-solid-svg-icons";
import {useCallback, useEffect, useState} from "react";
import usePostCommentCount from "../hooks/usePostCommentCount";

function PostCommentButton({postId, onOpen, onClose, isOpen = false, className = null}) {
  const [open, setOpen] = useState(isOpen)
  const [commentCount, commentCountLoading] = usePostCommentCount(postId)

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
        {(commentCountLoading || commentCount === 0) && (
          <>Σχόλια</>
        )}

        {commentCount === 1 && (
          <>{commentCount} σχόλιο</>
        )}

        {commentCount > 1 && (
          <>{commentCount} σχόλια</>
        )}
      </button>
    </div>
  )
}

export default PostCommentButton