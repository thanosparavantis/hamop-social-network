import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faCircleNotch} from "@fortawesome/free-solid-svg-icons";
import PageSettings from "../PageSettings";

function LoadingPage() {
  return (
    <>
      <PageSettings/>
      <main className="h-screen text-gray-900 flex items-center justify-center text-center text-3xl font-bold">
        <FontAwesomeIcon icon={faCircleNotch} spin={true} className="mr-3"/>
        Φόρτωση...
      </main>
    </>
  )
}

export default LoadingPage