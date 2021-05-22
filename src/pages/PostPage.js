import {useParams} from "react-router-dom";
import Navbar from "../components/Navbar";
import PageMeta from "../components/PageMeta";
import Post from "../components/Post";
import usePost from "../hooks/usePost";
import NotFoundPage from "./NotFoundPage";
import ErrorPage from "./ErrorPage";
import LoadingPage from "./LoadingPage";

function PostPage() {
  const {postId} = useParams()
  const [post, postLoading, postError, postFound] = usePost(postId)

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

        <main className="m-5 flex items-center justify-center">
          <div className="container max-w-2xl">
            <Post postId={post.id} expanded={true}/>
          </div>
        </main>
      </>
    )
  }
}

export default PostPage