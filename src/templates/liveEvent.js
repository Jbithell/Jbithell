import React from "react"
import { Helmet } from "react-helmet"
import { graphql } from "gatsby"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import Template from "../components/Template"

export default function PostTemplate({ data }) {
  const { markdownRemark: post } = data
  let image = post.frontmatter.featuredImage ? getImage(post.frontmatter.featuredImage) : false
  return (
    <Template smallBanner={true}>
      <Helmet title={`${post.frontmatter.Name} | Events | James Bithell`} />
      { image ? (<GatsbyImage class="rounded-t-lg w-full" image={image} alt={`${post.frontmatter.Name} | Credit: ${post.frontmatter.ImageCredit}`} />) : null }
      <div className="px-6 my-10 text-center">
        <h3 className="text-5xl font-semibold leading-normal text-gray-800">{post.frontmatter.Name}</h3>
        <h4 className="text-3xl mb-2 text-gray-800">{post.frontmatter.Client}</h4>
        <h4 className="text-2xl mb-2 text-gray-800">{post.frontmatter.Venue}, {(post.frontmatter.Date).split("-").join(' ')}</h4>
        <h5 className="text-xl mb-2 text-gray-800">{
          post.frontmatter.Roles.map((role, i) => {  
            return (i > 0 ? " | " : "") + role
          })
        }</h5>
        <div className="text-lg mb-2 text-gray-800"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />
        <h6 className="text-lg mb-2 text-gray-800">{post.frontmatter.Author ? "Written by " + post.frontmatter.Author : ""}</h6>
        <h6 className="text-lg mb-2 text-gray-800">{post.frontmatter.Author ? "Directed by " + post.frontmatter.Director : ""}</h6>
        <h6 className="text-base mb-2 text-gray-800">{post.frontmatter.ImageCredit ? "Image Credit: " + post.frontmatter.ImageCredit : ""}</h6>
      </div>
    </Template>
  )
}

export const pageQuery = graphql`
  query EventByPath($slug: String!,$type: String!) {
    markdownRemark(frontmatter: { slug: { eq: $slug }, type: { eq: $type } }) {
      html
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        slug
        Name
        Date
        EndDate
        Name
        Author
        Director
        Venue
        Roles
        Tags
        EventType
        PerformancesAttended
        Fee
        Professional
        Paid
        featuredImage {
          childImageSharp {
            gatsbyImageData(
              placeholder: BLURRED
              formats: [AUTO, WEBP]
            )
          }
        }
        ImageCredit
        Client
      }
    }
  }
`