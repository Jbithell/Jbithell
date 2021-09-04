import React from "react"
import { Helmet } from "react-helmet"
import { graphql } from "gatsby"
import Template from "../components/Template"

export default function PostTemplate({ data }) {
  const { markdownRemark: post } = data
  return (
    <Template smallBanner={true}>
      <Helmet title={post.frontmatter.title} />
      <div className="px-6 py-6">
      <h1 className="text-4xl font-semibold leading-normal mb-2 text-gray-800 text-center">{post.frontmatter.title}</h1>
        <div
          className="prose w-full max-w-full"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />
      </div>
    </Template>
  )
}

export const pageQuery = graphql`
  query PagePostByPath($slug: String!,$type: String!) {
    markdownRemark(frontmatter: { slug: { eq: $slug }, type: { eq: $type } }) {
      html
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        slug
        title
      }
    }
  }
`