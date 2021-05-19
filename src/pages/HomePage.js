import PageMeta from "../components/PageMeta";
import UserContext from "../UserContext";
import {useContext, useEffect, useRef, useState} from "react";
import Navbar from "../components/Navbar";
import PostEditor from "../components/PostEditor";
import firebase from "firebase";
import UserCard from "../components/UserCard";
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
        <main className="mx-5 my-10 flex items-center justify-center">
          <div className="container lg:grid lg:gap-10 lg:grid-cols-1 lg:grid-cols-4">
            <section className="hidden lg:block">
              <UserCard userId={user.uid} className="mb-10"/>
            </section>
            <section className="lg:col-span-3">
              <div className="mb-10">
                <PostEditor/>
              </div>

              {posts && posts.length > 0 ? (
                <div className="w-full">
                  {posts.map(postId => {
                    return <Post key={postId} postId={postId} className="mb-3"/>
                  })}
                </div>
              ) : (
                <div className="bg-white px-5 py-3 rounded shadow">
                  Δεν φαίνεται να υπάρχει κάτι εδώ.
                </div>
              )}
            </section>
          </div>
        </main>
      </>
    )
  }
}

export default HomePage

