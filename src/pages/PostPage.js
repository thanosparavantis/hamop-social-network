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

      <main className="m-5 flex items-center justify-center">
        <div className="container max-w-2xl">
          <Post postId={postId} comments={true}/>
        </div>
      </main>
    </>
  )
}

export default PostPage