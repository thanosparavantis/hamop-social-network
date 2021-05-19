import PageMeta from "../components/PageMeta";
import UserContext from "../UserContext";
import {useContext, useEffect, useRef, useState} from "react";
import Navbar from "../components/Navbar";
import PostEditor from "../components/PostEditor";
import firebase from "firebase";
import ErrorPage from "./ErrorPage";
import Post from "../components/Post";

function HomePage() {
  const user = useContext(UserContext)
  const [posts, setPosts] = useState()
  const [error, setError] = useState()
  let postsCallback = useRef()

  useEffect(() => {
    if (posts) {
      return
    }

    const unsubscribe = firebase.firestore()
      .collection("posts")
      .orderBy("creationDate", "desc")
      .limit(20)
      .onSnapshot(querySnapshot => {
        console.debug("[HomePage] Updating posts.")
        setPosts(querySnapshot.docs.map(doc => doc.id))
      }, error => setError(error))

    postsCallback.current = () => {
      console.debug("[HomePage] Unsubscribing from post updates.")
      unsubscribe()
    }
  }, [user, posts])

  useEffect(() => {
    return () => {
      if (postsCallback.current) {
        postsCallback.current()
      }
    }
  }, [])

  if (error) {
    return <ErrorPage error={error}/>
  } else {
    return (
      <>
        <Navbar/>
        <PageMeta title="Home"/>
        <main className="mx-5 my-5 flex items-center justify-center">
          <div className="container max-w-2xl">
            <div className="mb-10">
              <PostEditor/>
            </div>

            {posts && posts.length > 0 ? (
              <>
                {posts.map(postId => {
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

