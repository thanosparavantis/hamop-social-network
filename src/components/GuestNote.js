import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHandPeace, faSignInAlt} from "@fortawesome/free-solid-svg-icons";
import {useContext} from "react";
import UserContext from "../context/UserContext";

function GuestNote({className}) {
  const authUser = useContext(UserContext)

  return (
    <div className={className}>
      <div className="px-5 py-10 bg-white border-orange-400 shadow-lg rounded text-center">
        <h1 className="text-xl md:text-2xl text-gray-900 mb-3">
          <FontAwesomeIcon icon={faHandPeace} className="mr-2"/>
          Καλοσωρίσατε στο <span className="text-blue-600">Hamop.gr</span>
        </h1>

        <h2 className="text-lg text-gray-600">
          Η πρωτοποριακή διαδικτυακή κοινότητα στην Ελλάδα
        </h2>

        <button className="text-lg font-bold text-white w-full md:w-auto mt-8 md:px-20 py-3
                           shadow-lg rounded bg-gradient-to-br from-green-500 to-green-600"
                title="Συνδεθείτε ή δημιουργήστε έναν δωρεάν λογαριασμό"
                onClick={authUser.login}>
          <FontAwesomeIcon icon={faSignInAlt} className="mr-3"/>
          Σύνδεση
        </button>
      </div>
    </div>
  )
}

export default GuestNote