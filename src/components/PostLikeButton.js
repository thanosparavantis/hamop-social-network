import usePostLikeCount from "../hooks/usePostLikeCount";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faThumbsUp} from "@fortawesome/free-solid-svg-icons";
import useUserPostLike from "../hooks/useUserPostLike";
import UserContext from "../context/UserContext";
import {useCallback, useContext, useEffect} from "react";

function PostLikeButton({postId, className = null}) {
  const [likeCount, startLikeCount, stopLikeCount] = usePostLikeCount(postId)
  const authUser = useContext(UserContext)
  const [like, unlike, hasLiked] = useUserPostLike(authUser.uid, postId)

  useEffect(() => {
    startLikeCount()

    return () => {
      stopLikeCount()
    }
  }, [startLikeCount, stopLikeCount])

  const handleClick = useCallback(() => {
    if (hasLiked) {
      unlike()
    } else {
      like()
    }
  }, [hasLiked, like, unlike])

  return (
    <div className={className}>
      <button className={`px-3 py-2 text-sm shadow rounded font-bold
                          ${hasLiked ? "bg-green-500 text-white" : "bg-gray-100 text-gray-600 hover:text-gray-900"}`}
              onClick={handleClick}>
        <FontAwesomeIcon icon={faThumbsUp} className="mr-2"/>
        {likeCount ? likeCount : "-"}
      </button>
    </div>
  )
}

export default PostLikeButton