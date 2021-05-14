import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleNotch} from "@fortawesome/free-solid-svg-icons";
import PageSettings from "./PageSettings";

function HomePage() {
  return (
    <>
      <PageSettings title="Home"/>
      <div className="h-screen flex items-center justify-center text-center
                      font-bold text-2xl text-gray-900">
        <div className="px-10 py-8 bg-white shadow rounded">
          <FontAwesomeIcon icon={faCircleNotch} className="mr-3" spin={true}/>
          This website is under construction
        </div>
      </div>
    </>
  )
}

export default HomePage