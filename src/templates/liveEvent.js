import React from "react"
import { Helmet } from "react-helmet"
import { graphql } from "gatsby"
import Template from "../components/Template"

export default function PostTemplate({ data }) {
  const { markdownRemark: post } = data
  return (
    <Template>
      <Helmet title={`${post.frontmatter.Name} | Events | James Bithell`} />
      <div className="my-10 text-center">
        <div
          dangerouslySetInnerHTML={{ __html: post.html }}
        />
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
              width: 200
              placeholder: BLURRED
              formats: [AUTO, WEBP, AVIF]
            )
          }
        }
        ImageCredit
        Client
      }
    }
  }
`