import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faThumbsUp} from "@fortawesome/free-solid-svg-icons";
import useUserPostLike from "../hooks/useUserPostLike";
import UserContext from "../context/UserContext";
import {useCallback, useContext} from "react";
import usePost from "../hooks/usePost";

function PostLikeButton({postId, className = null}) {
  const authUser = useContext(UserContext)
  const [post, , postLoading, ,] = usePost(postId)
  const [like, unlike, hasLiked] = useUserPostLike(authUser.uid, postId)

  const handleClick = useCallback(() => {
    if (hasLiked) {
      unlike()
    } else {
      like()
    }
  }, [hasLiked, like, unlike])

  return (
    <div className={className}>
      <button className={`px-3 py-2 text-sm shadow rounded font-bold disabled:cursor-not-allowed
                          ${hasLiked ? "bg-green-500 text-white" : "bg-gray-100 text-gray-600 hover:text-gray-900"}`}
              onClick={handleClick}
              disabled={!authUser.loggedIn}>
        <FontAwesomeIcon icon={faThumbsUp} className="mr-2"/>
        {postLoading ? "-" : post.likeCount}
      </button>
    </div>
  )
}

export default PostLikeButton