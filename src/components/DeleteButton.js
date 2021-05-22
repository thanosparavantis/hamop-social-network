import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheckCircle, faTrashAlt} from "@fortawesome/free-regular-svg-icons";
import {useCallback, useState} from "react";

function DeleteButton({onConfirm, helpText}) {
  const [confirm, setConfirm] = useState(false)

  const handleClick = useCallback(() => {
    if (confirm) {
      onConfirm()
    } else {
      setConfirm(true)
    }
  }, [confirm, onConfirm])

  return (
    <button className={`px-3 py-2 rounded border
                        ${confirm ? "bg-red-500 text-white" : "bg-white text-gray-600 hover:text-gray-900"}`}
            title={helpText}
            onClick={handleClick}>
      {confirm ? (
        <FontAwesomeIcon icon={faCheckCircle}/>
      ) : (
        <FontAwesomeIcon icon={faTrashAlt}/>
      )}
    </button>
  )
}

export default DeleteButton