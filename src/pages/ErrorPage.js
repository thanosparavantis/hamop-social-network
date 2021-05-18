import PageMeta from "../components/PageMeta";
import Navbar from "../components/Navbar";

function ErrorPage({error}) {
  return (
    <>
      <PageMeta/>
      <Navbar/>
      <main className="flex items-center justify-center flex-col text-center" style={{height: "calc(100vh - 64px)"}}>
        <div className="mb-5">
          <h1 className="text-3xl text-gray-900 font-bold mb-2">hamop.gr</h1>
          <p className="text-xl text-gray-800">Δεν μπορέσαμε να επεξεργαστούμε το αίτημά σας.</p>
        </div>
        <div className="font-bold font-mono text-lg text-red-600">
          <h2><code>{error.code}</code></h2>
          <p><code>{error.message}</code></p>
        </div>
      </main>
    </>
  )
}

export default ErrorPage