import {Link} from "react-router-dom";
import TimeAgo from "timeago-react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleNotch} from "@fortawesome/free-solid-svg-icons";
import useUser from "../hooks/useUser";
import StarsBadge from "./StarsBadge";

function UserCard({userId, className = ""}) {
  const [user, loading, error] = useUser(userId)

  if (error) {
    return (
      <div
        className={`whitespace-pre-line break-words bg-white p-5 rounded shadow text-center font-bold text-red-600 ${className}`}>
        {error.code && (
          <div className="font-bold">
            {error.code}
          </div>
        )}

        <div>
          {error.message}
        </div>
      </div>
    )
  } else if (loading) {
    return (
      <div className={`bg-white p-5 rounded shadow text-center font-bold text-gray-600 ${className}`}>
        <FontAwesomeIcon icon={faCircleNotch} spin={true} size="lg" className="mr-3"/>
      </div>
    )
  } else {
    return (
      <Link to={`/${user.username}`}
            className={`flex items-center bg-white p-5 rounded shadow focus:ring ${className}`}>
        <img src={user.photoURL} alt={user.username} className="h-12 md:h-20 rounded shadow-lg border"/>
        <div className="ml-5">
          <div className="text-gray-900 font-bold leading-none">
            {user.displayName}
          </div>
          <div className="flex items-center mt-2">
            <StarsBadge user={user} className="mr-2"/>
            <div className="text-xs md:text-sm text-gray-600">
              Γράφτηκε <TimeAgo datetime={user.creationDate} locale="el"/>
            </div>
          </div>
        </div>
      </Link>
    )
  }
}

export default UserCard