import {useParams} from "react-router-dom";
import Navbar from "../components/Navbar";
import PageMeta from "../components/PageMeta";
import ErrorPage from "./ErrorPage";
import NotFoundPage from "./NotFoundPage";
import Post from "../components/Post";
import UserCard from "../components/UserCard";
import useUserPostList from "../hooks/useUserPostList";
import useUserFromUsername from "../hooks/useUserFromUsername";
import {useEffect} from "react";
import LoadingPage from "./LoadingPage";
import NothingHere from "../components/NothingHere";
import Sidebar from "../components/Sidebar";
import LoadMore from "../components/LoadMore";


function ProfilePage() {
  const {username} = useParams()
  const [user, userFound, userLoading, userError] = useUserFromUsername(username)
  const [postIds, startPosts, stopPosts, loadMorePosts, hasMorePosts, postError] = useUserPostList(user.uid)

  useEffect(() => {
    if (!userLoading) {
      startPosts()
    }

    return () => {
      stopPosts()
    }
  }, [startPosts, stopPosts, userLoading])

  if (!userFound) {
    return <NotFoundPage/>
  } else if (userError || postError) {
    return <ErrorPage/>
  } else if (userLoading) {
    return <LoadingPage/>
  } else {
    return (
      <>
        <PageMeta title={user.displayName}/>
        <Navbar/>
        <div className="flex items-center justify-center">
          <div className="container max-w-4xl grid grid-cols-1 md:grid-cols-4 md:gap-3">
            <Sidebar className="hidden md:block"/>
            <main className="mt-5 mx-5 md:mx-0 col-span-3">
              <UserCard userId={user.uid}/>

              {postIds.length > 0 ? (
                <div className="mt-3">
                  {postIds.map(postId => {
                    return <Post postId={postId} key={postId} className="mb-3"/>
                  })}

                  {hasMorePosts && (
                    <LoadMore onClick={loadMorePosts} className="mb-3"/>
                  )}
                </div>
              ) : (
                <NothingHere className="mt-3"/>
              )}
            </main>
          </div>
        </div>
      </>
    )
  }
}

export default ProfilePage