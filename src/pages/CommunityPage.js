import PageMeta from "../components/PageMeta";
import Navbar from "../components/Navbar";
import {useCallback, useState} from "react";
import ErrorPage from "./ErrorPage";
import UserCard from "../components/UserCard";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowDown, faUsers} from "@fortawesome/free-solid-svg-icons";
import useUserList from "../hooks/useUserList";

function CommunityPage() {
  const [userIds, userError] = useUserList()
  const userPageSize = 10
  const [userIndex, setUserIndex] = useState(userPageSize)

  const getUsers = useCallback(() => {
    return userIds.slice(0, userIndex)
  }, [userIds, userIndex])

  const hasMoreUsers = useCallback(() => {
    return userIds.length - 1 >= userIndex
  }, [userIds, userIndex])

  const progressUsers = useCallback(() => {
    if (userIndex + userPageSize <= userIds.length - 1) {
      setUserIndex(userIndex + userPageSize)
    } else {
      setUserIndex(userIndex + userIds.length)
    }
  }, [userIds, userIndex])

  if (userError) {
    return <ErrorPage/>
  } else {
    return (
      <>
        <PageMeta title="Κοινότητα"/>
        <Navbar/>
        <main className="m-5 flex items-center flex-col">
          <div className="container max-w-2xl">
            <h1 className="text-xl font-bold mb-5 text-gray-900">
              <FontAwesomeIcon icon={faUsers} className="mr-3"/>
              Κοινότητα
            </h1>

            {getUsers().map(userId => (
              <UserCard userId={userId} key={userId} className="mb-3"/>
            ))}

            {hasMoreUsers() && (
              <button className="w-full border-t px-5 py-6 bg-white shadow font-bold text-blue-600 hover:text-blue-500"
                      onClick={progressUsers}>
                <FontAwesomeIcon icon={faArrowDown} className="mr-2"/>
                Εμφάνιση χρηστών ({userIds.length - userIndex})
              </button>
            )}
          </div>
        </main>
      </>
    )
  }
}

export default CommunityPage