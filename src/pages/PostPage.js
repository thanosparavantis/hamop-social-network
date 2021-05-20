import {useParams} from "react-router-dom";
import Navbar from "../components/Navbar";
import PageMeta from "../components/PageMeta";
import Post from "../components/Post";

function PostPage() {
  const {postId} = useParams()

  return (
    <>
      <Navbar/>
      <PageMeta/>

      <main className="mx-5 my-5 flex items-center justify-center">
        <div className="container max-w-2xl">
          <Post postId={postId}/>
        </div>
      </main>
    </>
  )
}

export default PostPage