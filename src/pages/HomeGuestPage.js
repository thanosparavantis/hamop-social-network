import {useContext} from "react";
import UserContext from "../context/UserContext";
import Navbar from "../components/Navbar";
import PageMeta from "../components/PageMeta";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHandPeace, faSignInAlt, faStar} from "@fortawesome/free-solid-svg-icons";

function HomeGuestPage() {
  const user = useContext(UserContext)

  return (
    <>
      <Navbar/>
      <PageMeta title="Home"/>
      <main className="m-5 flex items-center justify-center">
        <div className="container max-w-2xl">
          <section className="h-56 bg-gray-100">
            <img src="/social.jpg"
                 alt="Φωτογραφία από την Ακρόπολη στην Αθήνα"
                 className="h-56 w-full object-cover rounded-t shadow"
            />
          </section>

          <main className="bg-white px-5 py-20 shadow text-center">
            <h1 className="text-xl md:text-2xl text-gray-900 mb-3">
              <FontAwesomeIcon icon={faHandPeace} className="mr-2"/>
              Καλοσωρίσατε στο <span className="text-blue-600">Hamop.gr</span>
            </h1>

            <h2 className="text-lg text-gray-600">
              Η πρωτοποριακή διαδικτυακή κοινότητα στην Ελλάδα
            </h2>

            <button className="text-xl font-bold text-white w-full md:w-auto md:px-20 py-3 shadow-lg rounded
                             mt-8 disabled:opacity-50 disabled:cursor-not-allowed
                             bg-gradient-to-br from-green-500 to-green-600"
                    title="Συνδεθείτε ή δημιουργήστε έναν δωρεάν λογαριασμό"
                    onClick={user.login}>
              <FontAwesomeIcon icon={faSignInAlt} className="mr-3"/>
              Σύνδεση
            </button>
          </main>

          <section className="bg-white px-5 py-20 shadow border-t text-center">
            <h1 className="mb-5 text-lg font-bold text-gray-900">
              <FontAwesomeIcon icon={faStar} className="mr-2"/>
              Δυνατότητες
            </h1>

            <div className="text-gray-700">
              <p className="mb-5">
                <strong className="text-blue-600">Ενισχύστε</strong> την
                παρουσία σας δημιουργώντας ένα προφίλ
              </p>
              <p className="mb-5">
                <strong className="text-blue-600">Μοιραστείτε</strong> ιδέες και
                απόψεις για γεγονότα που σας ενδιαφέρουν
              </p>
              <p className="mb-5">
                <strong className="text-blue-600">Αλληλεπιδράστε</strong> με την
                κοινότητα των χρηστών στην Ελλάδα
              </p>
              <p>
                <strong className="text-blue-600">Κερδίστε</strong> βραβεία
                και αναγνωριστείτε για τη συνεισφορά σας
              </p>
            </div>
          </section>
        </div>
      </main>
    </>
  )

}

export default HomeGuestPage