import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faCircleNotch} from "@fortawesome/free-solid-svg-icons";
import PageSettings from "../PageSettings";
import Navigation from "../Navigation";

function LoadingPage() {
  return (
    <>
      <PageSettings/>
      <Navigation/>
      <main className="full-height-adjusted flex items-center justify-center text-center">
        <h1 className="text-gray-900 text-3xl font-bold">
          <FontAwesomeIcon icon={faCircleNotch} spin={true} className="mr-3"/>
          Φόρτωση...
        </h1>
      </main>
    </>
  )
}

export default LoadingPage