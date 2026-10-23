

const Error = () => {
  return (
    <div className="flex items-center justify-center min-h-[60vh] ">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-700">404</h1>
        <p className="text-2xl mt-4 text-gray-500">The page you are looking for no longer exists.</p>
        <p className="text-gray-400 mt-2">We&apos;re sorry, but it looks like this page may be no longer available or does not exist.</p>
        <p className="text-gray-400 mt-2">
          Please click <a href="/" className="text-blue-500 underline">here</a> to go on Home page.
        </p>
      </div>
    </div>
  )
}

export default Error