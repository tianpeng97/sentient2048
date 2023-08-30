import React from 'react'

const LoginForm = ({
  handleLogin,
  username,
  setUsername,
  password,
  setPassword,
}) => {
  return (
    <div className="flex flex-grow items-top sm:items-center justify-center sm:py-16">
      <div className="mx-4 mb-16 max-h-[300px] sm:max-h-[1/3] sm:mb-0 sm:mx-0 space-y-8 bg-[#8f7a66] text-slate-800 p-8 sm:p-10 rounded-xl">
        <div>
          <h2 className="flex text-center justify-center text-3xl font-extrabold">
            Sign in
          </h2>
        </div>
        <form
          className="mt-8 space-y-6"
          onSubmit={handleLogin}
        >
          <div className="rounded-md shadow-sm">
            <div>
              <label
                className="sr-only"
                htmlFor="username"
              >
                Username
              </label>
              <input
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-slate-500 focus:border-slate-500 focus:z-10 sm:text-sm"
                id="username"
                type="text"
                value={username}
                placeholder="Username"
                name="username"
                onChange={({ target }) => setUsername(target.value)}
              />
            </div>
            <div>
              <label
                className="sr-only"
                htmlFor="password"
              >
                Password
              </label>
              <input
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-slate-500 focus:border-slate-500 focus:z-10 sm:text-sm mb-6"
                id="password"
                type="password"
                value={password}
                placeholder="Password"
                name="password"
                onChange={({ target }) => setPassword(target.value)}
              />
            </div>
            <div>
              <button
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-slate-700 hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
                type="submit"
              >
                Sign in
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default LoginForm
