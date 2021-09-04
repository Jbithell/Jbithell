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
        <h1 className="text-3xl text-center font-semibold leading-normal text-gray-800 mb-2">
          {post.frontmatter.title}
        </h1>
        <h2 className="text-xl text-center font-light text-gray-800 mb-1">{post.frontmatter.date}</h2>
        <div className="prose w-full max-w-full"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />
      </div>
    </Template>
  )
}

export const pageQuery = graphql`
  query BlogPostByPath($slug: String!,$type: String!) {
    markdownRemark(frontmatter: { slug: { eq: $slug }, type: { eq: $type } }) {
      html
      frontmatter {
        date(formatString: "DD MMMM YYYY")
        slug
        title
      }
    }
  }
`