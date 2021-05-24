import PageMeta from "../components/PageMeta";
import Navbar from "../components/Navbar";

function ErrorPage() {
  return (
    <>
      <PageMeta/>
      <Navbar/>
      <main className="full-height-adjusted flex items-center justify-center flex-col text-center">
        <div className="font-bold">
          <h1 className="text-3xl text-gray-900 mb-2">
            Hamop.gr
          </h1>
          <p className="text-xl text-red-600">
            Δεν μπορέσαμε να επεξεργαστούμε το αίτημά σας.
          </p>
        </div>
      </main>
    </>
  )
}

export default ErrorPage