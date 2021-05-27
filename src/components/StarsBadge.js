import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleNotch, faExclamationTriangle, faStar} from "@fortawesome/free-solid-svg-icons";
import useUserLikeCount from "../hooks/useUserLikeCount";

function StarsBadge({userId, className = null}) {
  const [likeCount, likeCountLoading, likeCountError] = useUserLikeCount(userId)

  if (likeCountError) {
    return (
      <div className={className}>
        <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-500"/>
      </div>
    )
  } else if (likeCountLoading) {
    return (
      <div className={className}>
        <FontAwesomeIcon icon={faCircleNotch} spin={true}/>
      </div>
    )
  } else {
    const stars = likeCount
    const starDisplay = stars.toLocaleString("el-GR")
    let bgColor = "bg-gray-200"

    if (stars >= 1000) {
      bgColor = "bg-red-400"
    } else if (stars >= 500) {
      bgColor = "bg-yellow-400"
    } else if (stars >= 100) {
      bgColor = "bg-yellow-300"
    }

    return (
      <div className={className}>
        <div className={`text-sm font-bold px-1 shadow rounded text-gray-900 select-none ${bgColor}`}>
          {starDisplay}
          <FontAwesomeIcon icon={faStar} size="sm" className="ml-1"/>
        </div>
      </div>
    )
  }
}

export default StarsBadge