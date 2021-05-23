import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleNotch, faExclamationTriangle} from "@fortawesome/free-solid-svg-icons";
import usePost from "../hooks/usePost";
import useUser from "../hooks/useUser";
import PostBody from "./PostBody";
import PostFooter from "./PostFooter";

function Post({postId, expanded = false, className = null}) {
  const [post, postLoading, postError] = usePost(postId)
  const [user, userLoading, userError] = useUser(post.author)

  if (postError || userError) {
    return (
      <div className={className}>
        <div className="bg-white font-bold p-5 rounded shadow text-red-600 text-center">
          <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2"/>
          Υπήρξε κάποιο τεχνικό θέμα, παρακαλώ προσπαθήστε αργότερα
        </div>
      </div>
    )
  } else if (postLoading || userLoading) {
    return (
      <div className={className}>
        <div className={`bg-white p-5 rounded shadow text-center font-bold text-gray-600`}>
          <FontAwesomeIcon icon={faCircleNotch} spin={true} size="lg"/>
        </div>
      </div>
    )
  } else {
    return (
      <div className={className}>
        <PostBody user={user} post={post}/>
        <PostFooter post={post} expanded={expanded}/>
      </div>
    )
  }
}

export default Post