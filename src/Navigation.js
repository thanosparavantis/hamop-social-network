import {Link} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSignInAlt, faSignOutAlt, faUsers} from "@fortawesome/free-solid-svg-icons";
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
                <Link to={`/${user.username}`} className="h-16 flex items-center justify-center px-5 hover:underline">
                  <img src={user.photoURL} alt={user.username} className="h-10 rounded-full shadow mr-3"/>
                  {user.displayName}
                </Link>
              </>
            ) : (
              <Link to="/" className="h-16 flex items-center justify-center px-3 hover:underline" onClick={user.login}>
                <FontAwesomeIcon icon={faSignInAlt} className="mr-2"/>
                Σύνδεση
              </Link>
            )}
            <Link to="/members" className="h-16 flex items-center justify-center px-3 hover:underline">
              <FontAwesomeIcon icon={faUsers} className="mr-2"/>
              Μέλη
            </Link>
            {user.loggedIn && (
              <Link to="/" className="h-16 flex items-center justify-center px-3 hover:underline" onClick={user.logout}>
                <FontAwesomeIcon icon={faSignOutAlt} className="mr-2"/>
                Αποσύνδεση
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navigation