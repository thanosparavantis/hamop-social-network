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
  const [users, setUsers] = useState()
  const [posts, setPosts] = useState()
  const [error, setError] = useState()
  let sidebarCallback = useRef()
  let postsCallback = useRef()

  useEffect(() => {
    const unsubscribe = firebase.firestore()
      .collection("users")
      .orderBy("creationDate", "desc")
      .limit(10)
      .onSnapshot(querySnapshot => {
          console.debug("[HomePage] Updating sidebar user profiles.")
          const docs = querySnapshot.docs.filter(doc => doc.id !== user.uid)
          setUsers(docs.map(doc => doc.id))
        },
        error => {
          setError(error)
        })

    sidebarCallback.current = () => {
      console.debug("[HomePage] Unsubscribing from sidebar.")
      unsubscribe()
    }
  }, [user])

  useEffect(() => {
    if (posts) {
      return
    }

    const unsubscribe = firebase.firestore()
      .collection("posts")
      .orderBy("creationDate", "desc")
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
      if (sidebarCallback.current) {
        sidebarCallback.current()
      }
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
          <div className="container grid gap-10 grid-cols-1 lg:grid-cols-4">
            <section>
              <h1 className="text-lg font-bold mb-3 text-gray-900">
                Εσείς
              </h1>

              <UserCard userId={user.uid} className="mb-10"/>

              <h1 className="text-lg font-bold mb-3 text-gray-900">
                Κοινότητα
              </h1>

              {users && users.map(userId => {
                return <UserCard key={userId} userId={userId} size="small" className="mb-3"/>
              })}
            </section>
            <section className="lg:col-span-3">
              <h1 className="text-lg font-bold mb-3 text-gray-900">
                Δημοσίευση
              </h1>

              <div className="mb-5">
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

