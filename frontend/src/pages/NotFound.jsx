import { Link } from "react-router";

export default function NotFound() {
  return (
    <div className="grid min-h-full place-items-center px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        <p className="text-2xl font-semibold text-blue-500">404</p>
        <h1 className="mt-4 text-5xl font-semibold tracking-tight text-balance  sm:text-7xl">
          Page not found
        </h1>
        <p className="mt-6 text-lg font-medium text-pretty text-gray-500 sm:text-xl">
          Sorry, we couldn't find the page you're looking for
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            to={"/"}
            className="btn bg-base-300 hover:bg-blue-200 m-1 transition duration-300"
          >
            Go back home
          </Link>
        </div>
      </div>
    </div>
  );
}
