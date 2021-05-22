import {Link} from "react-router-dom";
import TimeAgo from "timeago-react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleNotch} from "@fortawesome/free-solid-svg-icons";
import useUser from "../hooks/useUser";
import StarsBadge from "./StarsBadge";

function UserCard({userId, className = null}) {
  const [user, loading, error] = useUser(userId)

  if (error) {
    return (
      <div className={className}>
        <div className="whitespace-pre-line break-words bg-white p-5 rounded shadow text-center font-bold text-red-600">
          {error.code && (
            <div className="font-bold">
              {error.code}
            </div>
          )}

          <div>
            {error.message}
          </div>
        </div>
      </div>
    )
  } else if (loading) {
    return (
      <div className={className}>
        <div className="bg-white p-5 rounded shadow text-center font-bold text-gray-600">
          <FontAwesomeIcon icon={faCircleNotch} spin={true} size="lg" className="mr-3"/>
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
            <div className="flex items-center justify-center md:justify-start
                            mb-3 text-gray-900 font-bold leading-none">
              <StarsBadge user={user} className="mr-2 hidden md:block"/>
              {user.displayName}
            </div>
            <StarsBadge user={user} className="flex items-center justify-center mb-2 block md:hidden"/>
            <div className="text-sm text-gray-600">
              Γράφτηκε <TimeAgo datetime={user.creationDate} locale="el"/>
            </div>
            <div className="flex items-center flex-col md:flex-row text-sm text-gray-600">
              {user.postCount > 0 && (
                <div>
                  <strong>{user.postCount}</strong> {user.postCount > 1 ? "δημοσιεύσεις" : "δημοσίευση"}
                </div>
              )}

              {user.postCount > 0 && user.commentCount > 0 && (
                <div className="mx-2 hidden md:block">
                  &middot;
                </div>
              )}

              {user.commentCount > 0 && (
                <>
                  <div>
                    <strong>{user.commentCount}</strong> {user.commentCount > 1 ? "σχόλια" : "σχόλιο"}
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