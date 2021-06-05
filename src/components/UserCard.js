import {Link} from "react-router-dom";
import TimeAgo from "timeago-react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleNotch, faExclamationTriangle} from "@fortawesome/free-solid-svg-icons";
import useUser from "../hooks/useUser";
import useUserPostCount from "../hooks/useUserPostCount";
import useUserCommentCount from "../hooks/useUserCommentCount";

function UserCard({userId, className = null}) {
  const [user, userLoading, userError] = useUser(userId)
  const [postCount, postCountLoading, postCountError] = useUserPostCount(userId)
  const [commentCount, commentCountLoading, commentCountError] = useUserCommentCount(userId)

  if (userError || postCountError || commentCountError) {
    return (
      <div className={className}>
        <div className="bg-white font-bold p-5 rounded shadow text-red-600 text-center">
          <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2"/>
          Υπήρξε κάποιο τεχνικό θέμα, παρακαλώ προσπαθήστε αργότερα
        </div>
      </div>
    )
  } else if (userLoading || postCountLoading || commentCountLoading) {
    return (
      <div className={className}>
        <div className="bg-white p-5 rounded shadow text-center font-bold text-gray-600">
          <FontAwesomeIcon icon={faCircleNotch} spin={true} size="lg"/>
        </div>
      </div>
    )
  } else {
    return (
      <div className={className}>
        <Link to={`/${user.username}`}
              className="flex flex-col md:flex-row items-center text-center md:text-left
                         justify-center md:justify-start bg-white p-5 rounded shadow focus:ring">
          <img src={user.photoURL} alt={user.username} className="w-20 h-20 rounded shadow-lg border"/>
          <div className="mt-3 md:mt-0 md:ml-5">
            <div className="mb-2 text-gray-900 font-bold leading-none">
              {user.displayName}
            </div>
            <div className="text-sm text-gray-600">
              Γράφτηκε <TimeAgo datetime={user.creationDate} locale="el"/>
            </div>
            <div className="flex items-center flex-col md:flex-row text-sm text-gray-600">
              {postCount > 0 && (
                <div>
                  <strong>{postCount}</strong> {postCount > 1 ? "δημοσιεύσεις" : "δημοσίευση"}
                </div>
              )}

              {postCount > 0 && commentCount > 0 && (
                <div className="mx-2 hidden md:block">
                  &middot;
                </div>
              )}

              {commentCount > 0 && (
                <>
                  <div>
                    <strong>{commentCount}</strong> {commentCount > 1 ? "σχόλια" : "σχόλιο"}
                  </div>
                </>
              )}
            </div>
          </div>
        </Link>
      </div>
    )
  }
}

export default UserCard