import {useParams} from "react-router-dom";
import Navbar from "../components/Navbar";
import PageMeta from "../components/PageMeta";
import Post from "../components/Post";
import usePost from "../hooks/usePost";
import NotFoundPage from "./NotFoundPage";
import ErrorPage from "./ErrorPage";
import LoadingPage from "./LoadingPage";
import Sidebar from "../components/Sidebar";

function PostPage() {
  const {postId} = useParams()
  const [post, , postLoading, postError, postFound] = usePost(postId)

  if (!postFound) {
    return <NotFoundPage/>
  } else if (postError) {
    return <ErrorPage/>
  } else if (postLoading) {
    return <LoadingPage/>
  } else {
    return (
      <>
        <Navbar/>
        <PageMeta/>

        <div className="m-5 flex items-center justify-center">
          <div className="container max-w-4xl grid grid-cols-1 md:grid-cols-4 md:gap-3">
            <Sidebar className="hidden md:block"/>
            <Post postId={post.id} isExpanded={true} className="col-span-3"/>
          </div>
        </div>
      </>
    )
  }
}

export default PostPage