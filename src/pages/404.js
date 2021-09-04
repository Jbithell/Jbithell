import { Link } from "gatsby"
import * as React from "react"

import Template from "../components/Template"

const IndexPage = () => {
  return (
    <Template>
      <div className="px-6 mt-10 py-10 text-center">
        <h3 className="text-4xl font-semibold leading-normal mb-2 text-gray-800 mb-2">
        404 - Page not found
        </h3>
        <div className="flex flex-wrap justify-center">
          <div className="w-full lg:w-9/12 px-4">
            <p className="mb-4 text-lg leading-relaxed text-gray-800">
              Sorry, the page you requested couldn't be found. If you keep getting this error, please <Link to="/contact">contact me</Link>
            </p>
          </div>
        </div>
      </div>
    </Template>
  )
}

export default IndexPage