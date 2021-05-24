import PageMeta from "../components/PageMeta";
import Navbar from "../components/Navbar";
import {useContext, useEffect} from "react";
import usePostTopicList from "../hooks/usePostTopicList";
import ErrorPage from "./ErrorPage";
import Post from "../components/Post";
import LoadMore from "../components/LoadMore";
import NothingHere from "../components/NothingHere";
import PostEditor from "../components/PostEditor";
import Sidebar from "../components/Sidebar";
import TopicPreview from "../components/TopicPreview";
import UserContext from "../context/UserContext";
import GuestNote from "../components/GuestNote";

function TopicPage({topic}) {
  const authUser = useContext(UserContext)
  const [postIds, startPosts, stopPosts,
    loadMorePosts, hasMorePosts, postError] = usePostTopicList(topic)

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
        <PageMeta title={topic.title}/>
        <Navbar/>
        <div className="m-5 flex items-center justify-center">
          <div className="container max-w-4xl grid grid-cols-1 md:grid-cols-4 md:gap-3">
            <Sidebar activeTopic={topic} className="hidden md:block"/>
            <TopicPreview topic={topic} className="mb-3 md:hidden"/>
            <main className="col-span-3">
              {authUser.loggedIn ? (
                <PostEditor topic={topic} className="mb-3"/>
              ) : (
                <GuestNote className="mb-3"/>
              )}

              {postIds.length > 0 ? (
                <div>
                  {postIds.map(postId => {
                    return <Post key={postId} postId={postId} className="mb-3"/>
                  })}

                  {hasMorePosts && (
                    <LoadMore onClick={loadMorePosts}/>
                  )}
                </div>
              ) : (
                <NothingHere/>
              )}
            </main>
          </div>
        </div>
      </>
    )
  }
}

export default TopicPage