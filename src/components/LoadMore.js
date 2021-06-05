import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowDown} from "@fortawesome/free-solid-svg-icons";

function LoadMore({type = "primary", onClick, className = null}) {
  if (type === "secondary") {
    return (
      <div className={className}>
        <button className="w-full border-t px-5 py-6 bg-gray-100
                           shadow font-bold text-blue-600 hover:text-blue-500"
                onClick={onClick}>
          <FontAwesomeIcon icon={faArrowDown} className="mr-2"/>
          Εμφάνιση περισσότερων
        </button>
      </div>
    )
  } else {
    return (
      <div className={className}>
        <button
          className="w-full border-t px-5 py-6 bg-white rounded
                     shadow font-bold text-blue-600 hover:text-blue-500"
          onClick={onClick}>
          <FontAwesomeIcon icon={faArrowDown} className="mr-2"/>
          Εμφάνιση περισσότερων
        </button>
      </div>
    )
  }
}

export default LoadMore