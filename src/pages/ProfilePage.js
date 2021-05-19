import {useParams} from "react-router-dom";
import firebase from "firebase";
import {useEffect, useRef, useState} from "react";
import Navbar from "../components/Navbar";
import PageMeta from "../components/PageMeta";
import ErrorPage from "./ErrorPage";
import NotFoundPage from "./NotFoundPage";
import Post from "../components/Post";
import UserCard from "../components/UserCard";


function ProfilePage() {
  const {username} = useParams()
  const [error, setError] = useState()
  const [notFound, setNotFound] = useState(false)
  const [userId, setUserId] = useState()
  const [posts, setPosts] = useState()
  let userCallback = useRef()
  let postsCallback = useRef()

  useEffect(() => {
    const unsubscribe = firebase.firestore()
      .collection("users")
      .where("username", "==", username)
      .onSnapshot(querySnapshot => {
          console.debug("[ProfilePage] Updating user profile.")
          if (querySnapshot.size > 0) {
            setUserId(querySnapshot.docs[0].id)
            setNotFound(false)
          } else {
            setNotFound(true)
          }
        },
        error => {
          setError(error)
        })

    userCallback.current = () => {
      console.debug("[ProfilePage] Unsubscribing from user profile updates.")
      unsubscribe()
    }
  }, [username])

  useEffect(() => {
    if (!userId) {
      return
    }

    const unsubscribe = firebase.firestore()
      .collection("posts")
      .where("author", "==", userId)
      .orderBy("creationDate", "desc")
      .onSnapshot(querySnapshot => {
          console.debug("[ProfilePage] Updating user posts.")
          setPosts(querySnapshot.docs.map(doc => doc.id))
        },
        error => {
          setError(error)
        })
    postsCallback.current = () => {
      console.debug("[ProfilePage] Unsubscribing from user post updates.")
      unsubscribe()
    }
  }, [userId])

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
  } else {
    return (
      <>
        <PageMeta title={username}/>
        <Navbar/>
        <main className="my-5 mx-5 flex items-center justify-center">
          <div className="container max-w-2xl">
              {userId && (
                <UserCard userId={userId}/>
              )}

              {posts && posts.length > 0 ? (
                <div className="mt-3">
                  {posts.map(postId => {
                    return <Post postId={postId} key={postId} className="mb-3"/>
                  })}
                </div>
              ) : (
                <div className="mt-3 bg-white px-5 py-3 rounded shadow">
                  Δεν φαίνεται να υπάρχει κάτι εδώ.
                </div>
              )}
          </div>

        </main>
      </>
    )

  }
}

export default ProfilePage