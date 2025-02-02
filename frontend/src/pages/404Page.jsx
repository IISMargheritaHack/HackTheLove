
function Page404() {
  return (
    <div className="min-h-full flex flex-grow items-center justify-center">
      <div className="rounded-lg bg-white p-8 text-center shadow-xl">
        <h1 className="mb-4 text-4xl text-gray-600 font-bold">404</h1>
        <p className="text-gray-600">Oops! The page you are looking for could not be found.</p>
        <a href="/" className="mt-4 inline-block rounded bg-[#E6006F] px-4 py-2 font-semibold text-white hover:bg-[#E6006F]"> Go back to Home </a>
      </div>
    </div>
  );
}

export default Page404;
