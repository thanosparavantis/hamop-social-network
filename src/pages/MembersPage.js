import PageSettings from "../PageSettings";
import Navigation from "../Navigation";
import {useEffect, useState} from "react";
import firebase from "firebase";
import LoadingPage from "./LoadingPage";
import ErrorPage from "./ErrorPage";
import UserComponent from "../UserComponent";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSignInAlt, faUsers} from "@fortawesome/free-solid-svg-icons";

function MembersPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState()
  const [users, setUsers] = useState()

  useEffect(() => {
    firebase.firestore()
      .collection("users")
      .get()
      .then((querySnapshot) => {
          setUsers(querySnapshot.docs.map(doc => doc.data()))
        }
      )
      .catch(error => {
        setError(error)
      })
  }, [])

  useEffect(() => {
    if (users) {
      setLoading(false)
    }
  }, [users])

  if (error) {
    return <ErrorPage error={error}/>
  } else if (loading) {
    return <LoadingPage/>
  } else {
    console.log(users)
    return (
      <>
        <PageSettings title="Μέλη"/>
        <Navigation/>
        <main className="mt-10 flex items-center flex-col">
          <div className="container">
            <h1 className="text-xl font-bold mb-1 text-gray-900">
              <FontAwesomeIcon icon={faUsers} className="mr-3"/>
              Λίστα μελών
            </h1>

            <p className="mb-10 text-gray-800">
              Όλα τα καταχρωημένα μέλη στο hamop.gr.
            </p>

            {users.map(user => (
              <UserComponent user={user} key={user.uid}/>
            ))}
          </div>
        </main>
      </>
    )
  }
}

export default MembersPage