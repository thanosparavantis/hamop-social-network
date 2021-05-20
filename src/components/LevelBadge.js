import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faStar} from "@fortawesome/free-solid-svg-icons";

function LevelBadge({user, className = null}) {
  let bgColor = "bg-gray-200"

  if (user.postCount >= 100) {
    bgColor = "bg-red-400"
  } else if (user.postCount >= 50) {
    bgColor = "bg-yellow-400"
  }

  if (user.postCount === 0) {
    return (<></>)
  } else {
    return (
      <div className={`text-xs font-bold px-1 shadow rounded text-gray-900 select-none ${bgColor} ${className}`}
           title={`Το επίπεδο του χρήστη ${user.displayName}`}>
        {user.postCount}
        <FontAwesomeIcon icon={faStar} size="sm" className="ml-1"/>
      </div>
    )
  }
}

export default LevelBadge