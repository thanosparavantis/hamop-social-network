import {Link} from "react-router-dom";

function UserComponent({user}) {
  return (
    <Link to={`/${user.username}`} className="flex items-center bg-white p-5 rounded shadow mb-3">
      <div>
        <img src={user.photoURL} alt={user.username} className="h-16 rounded-full shadow-lg"/>
      </div>
      <div className="ml-5">
        <div className="font-bold">{user.displayName}</div>
        <div className="font-light">@{user.username}</div>
      </div>
    </Link>
  )
}

export default UserComponent