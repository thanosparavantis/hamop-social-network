import PageMeta from "../components/PageMeta";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHandPeace, faSignInAlt} from "@fortawesome/free-solid-svg-icons";
import UserContext from "../UserContext";
import {useContext, useEffect, useState} from "react";
import Navbar from "../components/Navbar";
import firebase from "firebase";
import Post from "../components/Post";

function HomePage() {
  const user = useContext(UserContext)
  const [userCount, setUserCount] = useState("-")

  useEffect(() => {
    const unsubscribe = firebase.firestore()
      .collection("users")
      .onSnapshot(querySnapshot => {
        setUserCount(querySnapshot.size)
      })

    return () => {
      unsubscribe()
    }
  }, [])

  if (user.loggedIn) {
    return (
      <>
        <Navbar/>
        <PageMeta title="Home"/>
        <main className="mx-5 my-10 flex items-center justify-center">
          <div className="container grid gap-5 grid-cols-3">
            <section>

            </section>
            <section className="col-span-2">
              <Post/>
            </section>
          </div>
        </main>
      </>
    )
  } else {
    return (
      <>
        <Navbar/>
        <PageMeta title="Home"/>
        <main className="mx-5 flex items-center justify-center full-height-adjusted flex-col text-center">
          <h1 className="text-xl md:text-2xl text-gray-900 font-bold mb-3">
            <FontAwesomeIcon icon={faHandPeace} className="mr-2"/>
            Καλοσωρίσατε στο <span className="text-indigo-500">Hamop.gr</span>
          </h1>
          <h2 className="text-lg text-gray-700">
            Η πρωτοποριακή διαδικτυακή κοινότητα στην Ελλάδα
          </h2>
          <p className="text-lg text-gray-700">
            Το Hamop.gr έχει <span className="font-bold">{userCount}</span> εγγεγραμμένους χρήστες
          </p>

          <button className="text-xl font-bold text-white w-full md:w-auto md:px-20 py-3 shadow-lg rounded
                             mt-8 bg-green-500 hover:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={user.login} disabled={user.loggedIn}>
            <FontAwesomeIcon icon={faSignInAlt} className="mr-3"/>
            Σύνδεση
          </button>
        </main>
      </>
    )
  }

}

export default HomePage