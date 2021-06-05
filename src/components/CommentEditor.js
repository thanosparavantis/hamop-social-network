import {useCallback, useContext, useState} from "react";
import firebase from "firebase/app";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleNotch, faTimes} from "@fortawesome/free-solid-svg-icons";
import TextareaAutosize from "react-textarea-autosize";
import UserContext from "../context/UserContext";

function CommentEditor({postId}) {
  const authUser = useContext(UserContext)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState()
  const [contentField, setContentField] = useState("")

  const handleContentField = useCallback((event) => {
    setContentField(event.target.value)
  }, [])

  const isContentFieldValid = useCallback(() => {
    const content = contentField.trim()
    return content.length > 0 && content.length <= 1000;
  }, [contentField])

  const handleSubmit = useCallback((event = null) => {
    if (event) {
      event.preventDefault()
    }

    if (!isContentFieldValid()) {
      return
    }

    setError(false)
    setLoading(true)

    const createPost = firebase
      .app()
      .functions("europe-west1")
      .httpsCallable("createComment")

    createPost({post: postId, content: contentField})
      .then(result => {
        const data = result.data

        if (data.success) {
          setLoading(false)
          setContentField("")
        }
      })
      .catch(error => {
        setLoading(false)
        setError(error.message)
      })
  }, [isContentFieldValid, contentField, postId])

  const handleKeyPress = useCallback((event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      handleSubmit()
    }
  }, [handleSubmit])

  return (
    <form action="#" method="POST" className="bg-gray-100 shadow border-t rounded-b px-5 py-4">
      <TextareaAutosize
        className="h-16 w-full text-sm border p-3 bg-white disabled:opacity-50
                   text-gray-900 focus:ring outline-none resize-none rounded"
        minRows="2"
        name="content"
        placeholder="Σχολίασε τη δημοσίευση..."
        onChange={handleContentField}
        onKeyPress={handleKeyPress}
        value={contentField}
        maxLength="1000"
        disabled={!authUser.loggedIn || loading}
        required={true}/>

      <div className="mt-1 flex items-center justify-between flex-col md:flex-row">
        <div>
          {error && (
            <div className="text-sm font-bold mb-3 text-red-600 md:mb-0 text-center md:text-left">
              <FontAwesomeIcon icon={faTimes} className="mr-2"/>
              {error}
            </div>
          )}
        </div>
        <button className="px-6 py-2 text-sm rounded shadow font-bold text-white hover:bg-green-500 w-full md:w-auto
                           bg-green-400 focus:ring outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleSubmit}
                disabled={!authUser.loggedIn || loading || !isContentFieldValid()}>
          {loading ? (
            <>
              <FontAwesomeIcon icon={faCircleNotch} spin={true} className="mr-3"/>
              Φόρτωση...
            </>
          ) : (
            <>Ανάρτηση</>
          )}
        </button>
      </div>
    </form>
  )
}

export default CommentEditor