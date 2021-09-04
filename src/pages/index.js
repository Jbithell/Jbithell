import * as React from "react"
import { StaticImage } from "gatsby-plugin-image"
import { graphql } from 'gatsby'

import Template from "./../components/Template"

const IndexPage = ({data}) => {
  return (
    <Template>
      <div className="flex flex-wrap justify-center">
        <div className="w-full px-4 mb-12 flex justify-center">
          <div className="relative">
            <StaticImage
              src="../assets/img/james.jpg"
              alt="A picture of James Bithell"
              className="shadow-xl rounded-full h-auto align-middle border-none absolute -m-16 -ml-20 lg:-ml-16.5"
              style={{ width: "150px" }}
            />
          </div>
        </div>
      </div>
      <div className="text-center mt-12 mb-6">
        <h3 className="text-4xl font-semibold leading-normal mb-2 text-gray-800 mb-2">
        {data.site.siteMetadata.personalDetails.name}
        </h3>
        <div className="text-sm leading-normal mt-0 mb-2 text-gray-500 font-bold uppercase">
        {data.site.siteMetadata.personalDetails.location}
        </div>
        { data.site.siteMetadata.personalDetails.company.jobTitle ? (
          <div className="mb-2 text-gray-700 mt-0">
          {data.site.siteMetadata.personalDetails.company.jobTitle} at <a href={data.site.siteMetadata.personalDetails.company.url} target="_blank" rel="noreferrer">{data.site.siteMetadata.personalDetails.company.name}</a>
          </div>
        ) : null}
        
      </div>
      {/*<div className="mt-10 py-10 border-t border-gray-300 text-center">
        <div className="flex flex-wrap justify-center">
          <div className="w-full lg:w-9/12 px-4">
            <p className="mb-4 text-lg leading-relaxed text-gray-800">
              An artist of considerable range, Jenna the name taken by
              Melbourne-raised, Brooklyn-based Nick Murphy writes,
              performs and records all of his own music, giving it a
              warm, intimate feel with a solid groove structure. An
              artist of considerable range.
            </p>
            <a
              href="#pablo"
              className="font-normal text-pink-500"
              onClick={e => e.preventDefault()}
            >
              Show more
            </a>
          </div>
        </div>
      </div>*/}
    </Template>
  )
}
export const query = graphql`
  query PersonalDetailsQuery {
    site {
      siteMetadata {
        personalDetails {
          name
          location
          company {
            jobTitle
            name
            url
          }
        }
      }
    }
  }
`

export default IndexPage