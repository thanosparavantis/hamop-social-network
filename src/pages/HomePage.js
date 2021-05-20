import PageMeta from "../components/PageMeta";
import Navbar from "../components/Navbar";
import PostEditor from "../components/PostEditor";
import ErrorPage from "./ErrorPage";
import Post from "../components/Post";
import usePostFeedList from "../hooks/usePostFeedList";
import {useEffect} from "react";

function HomePage() {
  const [postIds, startPosts, stopPosts, postError] = usePostFeedList()

  useEffect(() => {
    startPosts()

    return () => {
      stopPosts()
    }
  }, [startPosts, stopPosts])

  if (postError) {
    return <ErrorPage/>
  } else {
    return (
      <>
        <Navbar/>
        <PageMeta title="Home"/>
        <main className="m-5 flex items-center justify-center">
          <div className="container max-w-2xl">
            <PostEditor className="mb-3"/>

            {postIds.length > 0 ? (
              <>
                {postIds.map(postId => {
                  return <Post key={postId} postId={postId} className="mb-3"/>
                })}
              </>
            ) : (
              <div className="bg-white px-5 py-3 rounded shadow">
                Δεν φαίνεται να υπάρχει κάτι εδώ.
              </div>
            )}
          </div>
        </main>
      </>
    )
  }
}

export default HomePage

