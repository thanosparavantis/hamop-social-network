import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faStar} from "@fortawesome/free-solid-svg-icons";

function StarsBadge({user, className = null}) {
  const stars = user.postCount + user.commentCount
  const starDisplay = stars.toLocaleString("el-GR")
  let bgColor = "bg-gray-200"

  if (stars >= 1000) {
    bgColor = "bg-red-400"
  } else if (stars >= 500) {
    bgColor = "bg-yellow-400"
  } else if (stars >= 100) {
    bgColor = "bg-yellow-300"
  }

  if (stars === 0) {
    return (<></>)
  } else {
    return (
      <div className={className}>
        <div className={`text-sm md:text-sm font-bold px-1 shadow rounded text-gray-900 select-none ${bgColor}`}>
          {starDisplay}
          <FontAwesomeIcon icon={faStar} size="sm" className="ml-1"/>
        </div>
      </div>
    )
  }
}

export default StarsBadge