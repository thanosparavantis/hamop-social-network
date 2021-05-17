import {Link} from "react-router-dom";
import TimeAgo from "timeago-react";

function UserComponent({user}) {
  return (
    <Link to={`/${user.username}`} className="flex items-center bg-white p-5 rounded shadow focus:ring">
      <div>
        <img src={user.photoURL} alt={user.username} className="h-20 rounded shadow-lg border"/>
      </div>
      <div className="ml-5">
        <div className="font-bold">
          {user.displayName}
        </div>
        <p className="text-gray-600">
          Γράφτηκε <TimeAgo datetime={user.creationDate} locale="el" />
        </p>
      </div>
    </Link>
  )
}

export default UserComponent