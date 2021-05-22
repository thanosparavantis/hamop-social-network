import PageMeta from "../components/PageMeta";
import Navbar from "../components/Navbar";
import ErrorPage from "./ErrorPage";
import UserCard from "../components/UserCard";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUsers} from "@fortawesome/free-solid-svg-icons";
import useUserList from "../hooks/useUserList";
import LoadMore from "../components/LoadMore";

function CommunityPage() {
  const [userIds, loadMoreUsers, hasMoreUsers, userError] = useUserList()

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

            {userIds.map(userId => (
              <UserCard userId={userId} key={userId} className="mb-3"/>
            ))}

            {hasMoreUsers && (
              <LoadMore onClick={loadMoreUsers}/>
            )}
          </div>
        </main>
      </>
    )
  }
}

export default CommunityPage