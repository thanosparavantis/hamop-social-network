import {Link} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHouseUser, faSignInAlt, faSignOutAlt, faUserCircle} from "@fortawesome/free-solid-svg-icons";
import {useContext, useEffect, useState} from "react";
import UserContext from "../context/UserContext";
import topics from "../Topics"

function Navbar() {
  const user = useContext(UserContext)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    if (expanded) {
      document.body.classList.add("overflow-hidden")
    } else {
      document.body.classList.remove("overflow-hidden")
    }
  }, [expanded])

  function closeOnClick(event) {
    setExpanded(false)
  }

  function handleClick(event) {
    event.preventDefault()
    setExpanded(prev => !prev)
  }

  return (
    <>
      <div className={`absolute z-10 top-0 left-0 right-0 bottom-0 transition-all
                       bg-black w-full h-full hidden md:block
                       ${expanded ? "opacity-25" : "invisible opacity-0"}`}
           onClick={closeOnClick}/>

      <nav className="h-16 shadow-lg bg-blue-500 flex items-center justify-center">
        <div className="container max-w-4xl mx-5 text-white font-bold flex items-center justify-between">
          <Link to="/" className="h-16 text-lg flex items-center justify-center hover:underline">
            Hamop.gr
          </Link>

          {user.valid && (
            <div className="z-20 flex items-center">
              {user.loggedIn ? (
                <div className="select-none">
                  <div className={`h-16 md:w-56 w-14 md:px-0 py-5 flex items-center
                                 justify-center transition-all cursor-pointer select-none
                                 ${expanded ? "bg-white text-gray-900 border-b shadow-lg" : "hover:underline"}`}
                       onClick={handleClick}>
                    <img src={user.photoURL} alt={user.username} className="h-10 rounded shadow md:mr-3"/>
                    <div className="hidden md:block">{user.displayName}</div>
                  </div>

                  {/* Desktop Logged In */}
                  <div className={`w-56 absolute text-gray-700 shadow-lg rounded-b
                                 bg-white hidden md:flex flex-col
                                 transition-all ${expanded ? "opacity-100" : "invisible opacity-0"}`}>

                    <Link to={`/${user.username}`} className="px-10 py-5 border-b hover:underline focus:ring">
                      <FontAwesomeIcon icon={faUserCircle} className="mr-2"/>
                      Προφίλ
                    </Link>
                    <Link to="/" onClick={user.logout} className="px-10 py-5 cursor-pointer hover:underline focus:ring">
                      <FontAwesomeIcon icon={faSignOutAlt} className="mr-2"/>
                      Αποσύνδεση
                    </Link>
                  </div>

                  {/* Mobile Logged In */}
                  <div className={`flex md:hidden flex-col fixed left-0 right-0 w-screen overflow-scroll
                                 full-height-adjusted bg-gray-100 text-gray-700 text-lg
                                 ${expanded ? "opacity-100" : "invisible opacity-0"}`}>
                    {topics.map(topic => (
                      <Link to={topic.path}
                            onClick={closeOnClick}
                            key={topic.id}
                            className="flex items-center px-10 py-5 bg-white border-b hover:underline focus:ring">
                        <img src={require(`../images/topics/${topic.id}.png`).default}
                             alt={topic.title}
                             className="w-8 h-8 mr-3 object-contain"/>
                        {topic.title}
                      </Link>
                    ))}
                    <Link to={`/${user.username}`}
                          onClick={closeOnClick}
                          className="px-10 py-5 bg-white border-b hover:underline focus:ring">
                      <FontAwesomeIcon icon={faUserCircle} className="mr-2"/>
                      Προφίλ
                    </Link>
                    <Link to="/" onClick={user.logout}
                          className="px-10 py-5 border-b bg-white cursor-pointer hover:underline focus:ring">
                      <FontAwesomeIcon icon={faSignOutAlt} className="mr-2"/>
                      Αποσύνδεση
                    </Link>
                    <div className="flex-grow" onClick={closeOnClick}/>
                  </div>
                </div>
              ) : (
                <div className="select-none">
                  <div className={`h-16 md:w-48 w-14 md:px-10 py-5 flex items-center justify-center
                                 text-center transition-all cursor-pointer select-none
                                 ${expanded ? "bg-white text-gray-900 border-b shadow-lg" : "hover:underline"}`}
                       onClick={handleClick}>
                    <FontAwesomeIcon icon={faUserCircle} className="md:mr-2" size="lg"/>
                    <div className="hidden md:block">Επισκέπτης</div>
                  </div>

                  {/* Desktop Guest */}
                  <div className={`w-48 absolute text-gray-700 shadow-lg rounded-b
                                 bg-white hidden md:flex flex-col
                                 transition-all ${expanded ? "opacity-100" : "invisible opacity-0"}`}>
                    <Link to="/" className="px-10 py-5 border-b hover:underline focus:ring">
                      <FontAwesomeIcon icon={faHouseUser} className="mr-2"/>
                      Αρχική
                    </Link>
                    <Link to="/" onClick={user.login} className="px-10 py-5 hover:underline focus:ring">
                      <FontAwesomeIcon icon={faSignInAlt} className="mr-2"/>
                      Σύνδεση
                    </Link>
                  </div>

                  {/* Mobile Guest */}
                  <div className={`flex md:hidden flex-col fixed left-0 right-0 w-screen
                                 full-height-adjusted bg-gray-100 text-gray-700 text-lg
                                 ${expanded ? "opacity-100" : "invisible opacity-0"}`}>
                    <Link to="/" onClick={user.login}
                          className="px-10 py-5 border-b bg-white cursor-pointer hover:underline focus:ring">
                      <FontAwesomeIcon icon={faSignInAlt} className="mr-2"/>
                      Σύνδεση
                    </Link>
                    {topics.map(topic => (
                      <Link to={topic.path}
                            key={topic.id}
                            onClick={closeOnClick}
                            className="flex items-center px-10 py-5 bg-white border-b hover:underline focus:ring">
                        <img src={require(`../images/topics/${topic.id}.png`).default}
                             alt={topic.title}
                             className="w-8 h-8 mr-3 object-contain"/>
                        {topic.title}
                      </Link>
                    ))}
                    <div className="flex-grow" onClick={closeOnClick}/>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>
    </>
  )
}

export default Navbar