import PageSettings from "../PageSettings";

function ErrorPage({message}) {
  return (
    <>
      <PageSettings/>
      <main className="h-screen text-red-600 flex items-center justify-center text-center text-3xl font-bold">
        {message}
      </main>
    </>
  )
}

export default ErrorPage