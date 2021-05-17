import PageSettings from "../PageSettings";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSignInAlt} from "@fortawesome/free-solid-svg-icons";
import UserContext from "../UserContext";
import {useContext} from "react";

function HomePage() {
  const user = useContext(UserContext)

  return (
    <>
      <PageSettings title="Home"/>
      <main className="flex items-center flex-col text-center mt-10">
        <div className="container bg-white shadow rounded p-10">
          <h1 className="text-2xl font-bold mb-3">Καλοσωρίσατε στο Hamop.gr</h1>
          <h2 className="text-2xl font-light mb-8">Η πρώτη εφαρμογή κοινωνικής δικτύωσης στην Ελλάδα</h2>
          <button className="text-xl font-bold text-white px-20 py-3 shadow-lg rounded
                             bg-green-500 hover:bg-green-400" onClick={user.login}>
            <FontAwesomeIcon icon={faSignInAlt} className="mr-3"/>
            Σύνδεση
          </button>
        </div>
      </main>
    </>
  )
}

export default HomePage