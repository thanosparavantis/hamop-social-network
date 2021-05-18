import {useParams} from "react-router-dom";
import firebase from "firebase";
import {useEffect, useRef, useState} from "react";
import LoadingPage from "./LoadingPage";
import Navbar from "../components/Navbar";
import PageMeta from "../components/PageMeta";
import ErrorPage from "./ErrorPage";
import NotFoundPage from "./NotFoundPage";
import Post from "../components/Post";
import UserCard from "../components/UserCard";


function UserProfilePage() {
  const {username} = useParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState()
  const [notFound, setNotFound] = useState(false)
  const [user, setUser] = useState()
  let userCallback = useRef()
  let postsCallback = useRef()

  useEffect(() => {
    const unsubscribe = firebase.firestore()
      .collection("users")
      .where("username", "==", username)
      .onSnapshot(querySnapshot => {
          console.debug("[UserProfilePage] Updating user profile.")

          if (querySnapshot.size > 0) {
            const doc = querySnapshot.docs[0]
            const data = doc.data()

            setUser({
              uid: doc.id,
              displayName: data.displayName,
              username: data.username,
              photoURL: data.photoURL,
              creationDate: data.creationDate.toDate(),
            })

            setNotFound(false)
          } else {
            setNotFound(true)
          }
        },
        error => {
          setError(error)
        })

    userCallback.current = () => {
      console.debug("[UserProfilePage] Unsubscribing from user profile updates.")
      unsubscribe()
    }
  }, [username])

  useEffect(() => {
    if (!user || user.posts) {
      return
    }

    const unsubscribe = firebase.firestore()
      .collection("posts")
      .where("author", "==", user.uid)
      .orderBy("creationDate", "desc")
      .onSnapshot(querySnapshot => {
          console.debug("[UserProfilePage] Updating user posts.")
          const posts = querySnapshot.docs.map(doc => doc.id)

          setUser(oldUser => ({
            ...oldUser,
            posts: posts,
          }))
        },
        error => {
          setError(error)
        })

    postsCallback.current = () => {
      console.debug("[UserProfilePage] Unsubscribing from user post updates.")
      unsubscribe()
    }
  }, [user])

  useEffect(() => {
    if (user && loading && user.posts) {
      setLoading(false)
    }
  }, [user, loading])

  useEffect(() => {
    return () => {
      if (userCallback.current) {
        userCallback.current()
      }

      if (postsCallback.current) {
        postsCallback.current()
      }
    }
  }, [])

  if (notFound) {
    return <NotFoundPage/>
  } else if (error) {
    return <ErrorPage error={error}/>
  } else if (loading) {
    return <LoadingPage/>
  } else {
    return (
      <>
        <PageMeta title={user.username}/>
        <Navbar/>
        <main className="my-5 mx-5 flex items-center justify-center">
          <div className="container grid gap-10 grid-cols-4">
            <section>
              <UserCard user={user}/>
            </section>

            <section className="col-span-3">
              {user.posts && user.posts.length > 0 ? (
                <div className="w-full">
                  {user.posts.map(postId => {
                    return <Post postId={postId} key={postId} className="mb-3"/>
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

export default UserProfilePage