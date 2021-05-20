import {useCallback, useState} from "react";
import firebase from "firebase";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleNotch, faTimes} from "@fortawesome/free-solid-svg-icons";

function PostEditor({className = null}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState()
  const [contentField, setContentField] = useState("")

  const handleContentField = useCallback((event) => {
    setContentField(event.target.value)
  }, [])

  const isContentFieldValid = useCallback(() => {
    return contentField.length > 0 && contentField.length <= 300;
  }, [contentField])

  const handleSubmit = useCallback(event => {
    event.preventDefault()
    setError(false)
    setLoading(true)

    const createPost = firebase.functions().httpsCallable("createPost")

    createPost({content: contentField})
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
  }, [contentField])

  return (
    <form action="#" method="POST" className={`flex flex-col ${className}`}>
      <textarea
        className="h-28 w-full rounded-t p-3 shadow-lg bg-white disabled:opacity-50
                   text-gray-900 focus:ring outline-none resize-none"
        placeholder="Γράψε μια δημοσίευση..."
        onChange={handleContentField}
        value={contentField}
        maxLength="300"
        disabled={loading}
        required={true}
      >
      </textarea>

      <div className="bg-gray-100 px-5 py-3 shadow border-t flex items-center justify-between flex-col md:flex-row">
        <div className="font-bold mb-3 md:mb-0 text-center md:text-left">
          {error && (
            <p className="text-red-600">
              <FontAwesomeIcon icon={faTimes} className="mr-2"/>
              {error}
            </p>
          )}
        </div>
        <button className="px-6 py-2 rounded shadow font-bold text-white hover:bg-green-500 w-full md:w-auto
                           bg-green-400 focus:ring outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleSubmit}
                disabled={loading || !isContentFieldValid()}>
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

export default PostEditor