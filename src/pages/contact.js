import { Link } from "gatsby"
import * as React from "react"

import Template from "../components/Template"

import { FaTwitter, FaFacebook, FaGithub, FaLinkedin } from "react-icons/fa";

const IndexPage = () => {
  return (
    <Template>
      <div className="px-6 py-10 text-center">
        <h3 className="text-4xl font-semibold leading-normal mb-2 text-gray-800 mb-2">
        Contact
        </h3>
        <div className="flex flex-wrap justify-center">
          <div className="w-full lg:w-9/12 px-4">
            <a
              className="bg-white text-blue-400 shadow-lg font-normal h-10 w-10 items-center justify-center align-center rounded-full outline-none focus:outline-none mr-2 p-3"
              type="button"
              href="https://twitter.com/bithelljames"
              title="Twitter"
            >
              <FaTwitter className="flex" />
            </a>
            <a
              className="bg-white text-blue-600 shadow-lg font-normal h-10 w-10 items-center justify-center align-center rounded-full outline-none focus:outline-none mr-2 p-3"
              type="button"
              href="https://facebook.com/bithellj"
              title="Facebook"
            >
              <FaFacebook className="flex" />
            </a>
            <a
              className="bg-white text-blue-500 shadow-lg font-normal h-10 w-10 items-center justify-center align-center rounded-full outline-none focus:outline-none mr-2 p-3"
              type="button"
              href="https://linkedin.com/in/jbithell"
              title="LinkedIn"
            >
              <FaLinkedin className="flex" />
            </a>
            <a
              className="bg-white text-gray-900 shadow-lg font-normal h-10 w-10 items-center justify-center align-center rounded-full outline-none focus:outline-none mr-2 p-3"
              type="button"
              href="https://github.com/jbithell"
              title="Github"
            >
              <FaGithub className="flex" />
            </a>
            <p className="mt-3 text-lg leading-relaxed text-gray-800">
                Alternatively, send me an email at hi@jbithell.com. <a style={{ "font-style": "italic" }} target="_blank" rel="noreferrer" href="https://pgp.mit.edu/pks/lookup?op=vindex&search=0x5E8B434F3337DAA4">Public Key</a>
            </p>
          </div>
        </div>
      </div>
    </Template>
  )
}

export default IndexPage