import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowDown} from "@fortawesome/free-solid-svg-icons";

function LoadMore({type = "primary", onClick}) {
  if (type === "secondary") {
    return (
      <button className="w-full border-t px-5 py-6 bg-gray-100 shadow font-bold text-blue-600 hover:text-blue-500"
              onClick={onClick}>
        <FontAwesomeIcon icon={faArrowDown} className="mr-2"/>
        Εμφάνιση περισσότερων
      </button>
    )
  } else {
    return (
      <button className="w-full border-t px-5 py-6 bg-white rounded shadow font-bold text-blue-600 hover:text-blue-500"
              onClick={onClick}>
        <FontAwesomeIcon icon={faArrowDown} className="mr-2"/>
        Εμφάνιση περισσότερων
      </button>
    )
  }
}

export default LoadMore