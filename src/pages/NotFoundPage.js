import PageSettings from "../PageSettings";
import Navigation from "../Navigation";

function NotFoundPage() {
  return (
    <>
      <PageSettings/>
      <Navigation/>
      <main className="full-height-adjusted flex items-center justify-center flex-col text-center">
        <h1 className="text-3xl text-gray-900 font-bold mb-2">
          hamop.gr
        </h1>
        <p className="text-xl text-gray-800">
          Δεν φαίνεται να υπάρχει κάτι εδώ.
        </p>
      </main>
    </>
  )
}

export default NotFoundPage