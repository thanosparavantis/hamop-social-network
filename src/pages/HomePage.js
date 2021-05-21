import PageMeta from "../components/PageMeta";
import Navbar from "../components/Navbar";
import PostEditor from "../components/PostEditor";
import ErrorPage from "./ErrorPage";
import Post from "../components/Post";
import usePostFeedList from "../hooks/usePostFeedList";
import {useEffect} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowDown} from "@fortawesome/free-solid-svg-icons";

function HomePage() {
  const [postIds, startPosts, stopPosts, loadMorePosts, hasMorePosts, postError] = usePostFeedList()

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
              <div>
                {postIds.map(postId => {
                  return <Post key={postId} postId={postId} className="mb-3"/>
                })}

                { hasMorePosts && (
                  <button className="w-full border-t px-5 py-6 bg-white rounded shadow font-bold text-blue-600 hover:text-blue-500"
                          onClick={loadMorePosts}>
                    <FontAwesomeIcon icon={faArrowDown} className="mr-2"/>
                    Εμφάνιση περισσότερων
                  </button>
                )}
              </div>
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

