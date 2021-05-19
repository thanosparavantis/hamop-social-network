import PageMeta from "../components/PageMeta";
import Navbar from "../components/Navbar";
import {useEffect, useRef, useState} from "react";
import firebase from "firebase";
import ErrorPage from "./ErrorPage";
import UserCard from "../components/UserCard";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUsers} from "@fortawesome/free-solid-svg-icons";

function CommunityPage() {
  const [error, setError] = useState()
  const [users, setUsers] = useState()
  const userCallback = useRef()

  useEffect(() => {
    const unsubscribe = firebase.firestore()
      .collection("users")
      .orderBy("creationDate", "desc")
      .onSnapshot(querySnapshot => {
          console.debug("[CommunityPage] Updating user list.")
          setUsers(querySnapshot.docs.map(doc => doc.id))
        }, error => setError(error)
      )
    userCallback.current = () => {
      console.debug("[CommunityPage] Unsubscribing from user updates.")
      unsubscribe()
    }
  }, [])

  useEffect(() => {
    return () => {
      if (userCallback.current) {
        userCallback.current()
      }
    }
  }, [])

  if (error) {
    return <ErrorPage error={error}/>
  } else {
    return (
      <>
        <PageMeta title="Κοινότητα"/>
        <Navbar/>
        <main className="my-10 mx-5 flex items-center flex-col">
          <div className="container max-w-2xl">
            <h1 className="text-xl font-bold mb-5 text-gray-900">
              <FontAwesomeIcon icon={faUsers} className="mr-3"/>
              Κοινότητα
            </h1>

            {users && users.map(userId => (
              <UserCard userId={userId} key={userId} className="mb-3"/>
            ))}
          </div>
        </main>
      </>
    )
  }
}

export default CommunityPage