import {Link} from "react-router-dom";
import TimeAgo from "timeago-react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleNotch, faExclamationTriangle} from "@fortawesome/free-solid-svg-icons";
import useUser from "../hooks/useUser";

function UserCard({userId, className = null}) {
  const [user, userLoading, userError] = useUser(userId)

  if (userError) {
    return (
      <div className={className}>
        <div className="bg-white font-bold p-5 rounded shadow text-red-600 text-center">
          <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2"/>
          Υπήρξε κάποιο τεχνικό θέμα, παρακαλώ προσπαθήστε αργότερα
        </div>
      </div>
    )
  } else if (userLoading) {
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
                <div>
                  <strong>{user.postCount}</strong> {user.postCount !== 1 ? "δημοσιεύσεις" : "δημοσίευση"}
                </div>

              <div className="mx-2 hidden md:block">
                &middot;
              </div>

                <div>
                  <strong>{user.commentCount}</strong> {user.commentCount !== 1 ? "σχόλια" : "σχόλιο"}
                </div>

              <div className="mx-2 hidden md:block">
                &middot;
              </div>

                <div>
                  <strong>{user.likeCount}</strong> {user.likeCount !== 1 ? "likes" : "like"}
                </div>
            </div>
          </div>
        </Link>
      </div>
    )
  }
}

export default UserCard