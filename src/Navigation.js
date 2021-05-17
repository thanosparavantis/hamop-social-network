import {Link} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHouseUser, faSignInAlt, faSignOutAlt, faUserCircle, faUsers} from "@fortawesome/free-solid-svg-icons";
import {useContext, useEffect, useRef, useState} from "react";
import UserContext from "./UserContext";

function Navigation() {
  const user = useContext(UserContext)
  const [expanded, setExpanded] = useState(false)
  const node = useRef()

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [])

  useEffect(() => {
    if (expanded) {
      document.body.classList.add("overflow-hidden")
    } else {
      document.body.classList.remove("overflow-hidden")
    }
  }, [expanded])

  function handleOutsideClick(event) {
    if (!node.current) {
      return
    }

    if (node.current.contains(event.target)) {
      return
    }

    setExpanded(false)
  }

  function handleClick(event) {
    event.preventDefault()
    setExpanded(prev => !prev)
  }

  return (
    <nav className="h-16 shadow-lg bg-blue-500 flex items-center justify-center">
      <div className="container mx-5 text-white font-bold flex items-center justify-between">
        <div>
          <Link to="/" className="h-16 text-lg md:flex hidden items-center justify-center hover:underline">
            Hamop.gr
          </Link>
        </div>

        {user.valid && (
          <div className="flex items-center">
            {user.loggedIn ? (
              <div ref={node} className="select-none">
                <div className={`h-16 md:w-56 px-10 py-5 flex items-center justify-center transition-all
                                 hover:underline cursor-pointer select-none
                                 ${expanded ? "bg-white text-gray-900 border-b shadow-lg" : ""}`}
                     onClick={handleClick}>
                  <img src={user.photoURL} alt={user.username} className="h-10 rounded-full shadow mr-3"/>
                  {user.username}
                </div>

                {/* Desktop Logged In */}
                <div className={`w-56 absolute text-gray-700 shadow-lg rounded-b bg-white
                                 hidden md:flex flex-col
                                 transition-all ${expanded ? "opacity-100" : "invisible opacity-0"}`}>
                  <Link to="/" className="px-10 py-5 border-b hover:underline focus:ring">
                    <FontAwesomeIcon icon={faHouseUser} className="mr-2"/>
                    Αρχική
                  </Link>
                  <Link to={`/${user.username}`} className="px-10 py-5 border-b hover:underline focus:ring">
                    <FontAwesomeIcon icon={faUserCircle} className="mr-2"/>
                    Προφίλ
                  </Link>
                  <Link to="/members" className="px-10 py-5 border-b hover:underline focus:ring">
                    <FontAwesomeIcon icon={faUsers} className="mr-2"/>
                    Μέλη
                  </Link>
                  <div onClick={user.logout} className="px-10 py-5 cursor-pointer hover:underline focus:ring">
                    <FontAwesomeIcon icon={faSignOutAlt} className="mr-2"/>
                    Αποσύνδεση
                  </div>
                </div>

                {/* Mobile Logged In */}
                <div className={`flex md:hidden flex-col fixed left-0 right-0 w-screen
                                 full-height-adjusted bg-white text-gray-700 text-lg
                                 ${expanded ? "opacity-90" : "invisible opacity-0"}`}>
                  <Link to="/" className="px-10 py-5 border-b hover:underline focus:ring">
                    <FontAwesomeIcon icon={faHouseUser} className="mr-2"/>
                    Αρχική
                  </Link>
                  <Link to={`/${user.username}`} className="px-10 py-5 border-b hover:underline focus:ring">
                    <FontAwesomeIcon icon={faUserCircle} className="mr-2"/>
                    Προφίλ
                  </Link>
                  <Link to="/members" className="px-10 py-5 border-b hover:underline focus:ring">
                    <FontAwesomeIcon icon={faUsers} className="mr-2"/>
                    Μέλη
                  </Link>
                  <div onClick={user.logout} className="px-10 py-5 border-b cursor-pointer hover:underline focus:ring">
                    <FontAwesomeIcon icon={faSignOutAlt} className="mr-2"/>
                    Αποσύνδεση
                  </div>
                </div>

              </div>
            ) : (
              <div ref={node} className="select-none">
                <div className={`h-16 md:w-56 px-10 py-5 hover:underline cursor-pointer transition-all
                                 hover:underline cursor-pointer
                                 ${expanded ? "bg-white text-gray-900 border-b shadow-lg" : ""}`}
                     onClick={handleClick}>
                  <FontAwesomeIcon icon={faUserCircle} className="mr-2"/>
                  Επισκέπτης
                </div>

                {/* Desktop Guest */}
                <div className={`w-56 absolute text-gray-700 shadow-lg rounded-b bg-white
                                 hidden md:flex flex-col
                                 transition-all ${expanded ? "opacity-100" : "invisible opacity-0"}`}>
                  <Link to="/members" className="px-10 py-5 border-b hover:underline focus:ring">
                    <FontAwesomeIcon icon={faUsers} className="mr-2"/>
                    Μέλη
                  </Link>
                  <Link to="/" onClick={user.login} className="px-10 py-5 hover:underline focus:ring">
                    <FontAwesomeIcon icon={faSignInAlt} className="mr-2"/>
                    Σύνδεση
                  </Link>
                </div>

                {/* Mobile Guest */}
                <div className={`flex md:hidden flex-col fixed left-0 right-0 w-screen
                                 full-height-adjusted bg-white text-gray-700 text-lg
                                 ${expanded ? "opacity-90" : "invisible opacity-0"}`}>
                  <Link to="/" className="px-10 py-5 border-b hover:underline focus:ring">
                    <FontAwesomeIcon icon={faHouseUser} className="mr-2"/>
                    Αρχική
                  </Link>
                  <Link to="/members" className="px-10 py-5 border-b hover:underline focus:ring">
                    <FontAwesomeIcon icon={faUsers} className="mr-2"/>
                    Μέλη
                  </Link>
                  <div onClick={user.login} className="px-10 py-5 border-b cursor-pointer hover:underline focus:ring">
                    <FontAwesomeIcon icon={faSignInAlt} className="mr-2"/>
                    Σύνδεση
                  </div>
                </div>

              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navigation