import {useCallback, useState} from "react";
import firebase from "firebase";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck, faCircleNotch, faTimes} from "@fortawesome/free-solid-svg-icons";

function PostEditor() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState()
  const [contentField, setContentField] = useState("")

  const handleContentField = useCallback((event) => {
    setContentField(event.target.value)
  }, [])

  const handleSubmit = useCallback(event => {
    event.preventDefault()
    setError(false)
    setSuccess(false)

    if (contentField.length === 0) {
      setError("Πρέπει να γράψετε κάτι στην δημοσίευσή σας.")
      return
    }

    setLoading(true)

    const createPost = firebase.functions().httpsCallable("createPost")

    createPost({content: contentField})
      .then(result => {
        const data = result.data

        if (data.success) {
          setLoading(false)
          setSuccess(true)
          setContentField("")
        }
      })
      .catch(error => {
        setLoading(false)
        setError(error.message)
      })
  }, [contentField])

  const clearMessages = useCallback(event => {
    setError(false)
    setSuccess(false)
  }, [])

  return (
    <form action="#" method="POST">
      <div>
        <textarea
          className="h-20 w-full border rounded p-3 shadow-lg bg-white disabled:opacity-50
                     text-gray-900 focus:ring outline-none resize-none"
          placeholder="Γράψτε εδώ ότι σκέφτεστε..."
          onChange={handleContentField}
          onFocus={clearMessages}
          value={contentField}
          disabled={loading}
          required={true}
        >
        </textarea>
      </div>

      <div className="mt-1 flex items-center justify-between flex-col md:flex-row">
        <div className="font-bold mb-3 md:mb-0 text-center md:text-left">
          {success && (
            <p className="text-green-600">
              <FontAwesomeIcon icon={faCheck} className="mr-2"/>
              Επιτυχία
            </p>
          )}

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
                disabled={loading}>
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