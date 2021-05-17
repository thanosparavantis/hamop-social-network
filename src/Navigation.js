import {Link} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSignInAlt} from "@fortawesome/free-solid-svg-icons";
import {useContext} from "react";
import UserContext from "./UserContext";

function Navigation() {
  const user = useContext(UserContext)

  return (
    <nav className="h-16 shadow-lg bg-blue-500 flex items-center justify-center">
      <div className="container text-white font-bold flex items-center justify-between">
        <div>
          <Link to="/" className="h-16 text-lg flex items-center justify-center px-8 bg-blue-600 hover:underline">
            hamop.gr
          </Link>
        </div>

        {user.valid && (
          <div className="flex items-center">
            {user.loggedIn ? (
              <>
                <Link to={`/${user.username}`} className="h-16 flex items-center justify-center px-8 hover:underline">
                  <img src={user.photoURL} alt={user.username} className="h-10 rounded-full shadow mr-3"/>
                  {user.displayName}
                </Link>
                <Link to="/" className="h-16 flex items-center justify-center px-2 hover:underline" onClick={user.logout}>
                  Αποσύνδεση
                </Link>
              </>
            ) : (
              <Link to="/" className="h-16 flex items-center justify-center px-2 hover:underline" onClick={user.login}>
                <FontAwesomeIcon icon={faSignInAlt} className="mr-3"/>
                Σύνδεση
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navigation