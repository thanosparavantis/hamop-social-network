import {Link} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSignInAlt} from "@fortawesome/free-solid-svg-icons";
import firebase from "firebase";
import {useContext} from "react";
import UserContext from "./UserContext";

function Navigation() {
  const user = useContext(UserContext)
  const provider = new firebase.auth.GoogleAuthProvider();

  function handleSignIn(event) {
    event.preventDefault()
    firebase.auth().signInWithRedirect(provider)
  }

  return (
    <nav className="h-16 shadow-lg bg-blue-500 flex items-center justify-center">
      <div className="container text-lg text-white font-bold flex items-center justify-between">
        <div>
          <Link to="/" className="h-16 flex items-center justify-center px-8 bg-blue-600 hover:underline">
            hamop.gr
          </Link>
        </div>

        <div className="flex items-center">
          {user.loggedIn ? (
            <>
              <Link to="/" className="h-16 flex items-center justify-center px-8 hover:underline">
                <img src={user.photo} alt={user.username} className="h-10 rounded-full shadow mr-3"/>
                {user.username}
              </Link>
              <Link to="/" className="h-16 flex items-center justify-center px-8 hover:underline" onClick={user.logout}>
                Logout
              </Link>
            </>
          ) : (
            <Link to="/" className="h-16 flex items-center justify-center px-8 hover:underline"
                  onClick={handleSignIn}>
              <FontAwesomeIcon icon={faSignInAlt} className="mr-3"/>
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navigation