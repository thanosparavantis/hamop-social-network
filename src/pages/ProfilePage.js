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


function ProfilePage() {
  const {username} = useParams()
  const [user, userFound, userLoading, userError] = useUserFromUsername(username)
  const [postIds, startPosts, stopPosts, postError] = useUserPostList(user.uid)

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
        <PageMeta title={username}/>
        <Navbar/>
        <main className="m-5 flex items-center justify-center">
          <div className="container max-w-2xl">
            <UserCard userId={user.uid}/>

            {postIds.length > 0 ? (
              <div className="mt-3">
                {postIds.map(postId => {
                  return <Post postId={postId} key={postId} className="mb-3"/>
                })}
              </div>
            ) : (
              <div className="mt-3 bg-white px-5 py-3 rounded shadow">
                Δεν φαίνεται να υπάρχει κάτι εδώ.
              </div>
            )}
          </div>

        </main>
      </>
    )
  }
}

export default ProfilePage