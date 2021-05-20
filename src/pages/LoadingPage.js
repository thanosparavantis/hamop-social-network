import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faCircleNotch} from "@fortawesome/free-solid-svg-icons";
import PageMeta from "../components/PageMeta";
import Navbar from "../components/Navbar";

function LoadingPage() {
  return (
    <>
      <PageMeta/>
      <Navbar/>
      <main className="full-height-adjusted flex items-center justify-center text-center">
        <FontAwesomeIcon icon={faCircleNotch} size="2x" spin={true} className="text-gray-600"/>
      </main>
    </>
  )
}

export default LoadingPage