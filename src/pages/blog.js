import { Link, graphql } from "gatsby"
import * as React from "react"

import Template from "../components/Template"

const BlogPostsPage = ({data}) => {
  const { edges: posts } = data.allMarkdownRemark
  return (
    <Template>
      <div className="px-6 mt-10 py-10 text-center">
        <h3 className="text-4xl font-semibold leading-normal mb-2 text-gray-800 mb-2">
        Blog Posts
        </h3>
        <div className="flex flex-wrap justify-center">
          <div className="w-full lg:w-9/12 px-4">
          {posts.filter(post => (post.node.frontmatter.title.length > 0 && post.node.frontmatter.type === "blog" && post.node.frontmatter.example !== true)).map(({ node: post }) => {
            return (
              <div className="blog-post-preview" key={post.id}>
                <h1>
                  <Link to={`/posts/${post.frontmatter.slug}`}>{post.frontmatter.title}</Link>
                </h1>
                <h2>{post.frontmatter.date}</h2>
                <p>{post.excerpt}</p>
              </div>
            )
          })}
          </div>
        </div>
      </div>
    </Template>
  )
}

export const pageQuery = graphql`
  query blogPostQuery {
    allMarkdownRemark(sort: { order: DESC, fields: [frontmatter___date] }) {
      edges {
        node {
          excerpt(pruneLength: 250)
          id
          frontmatter {
            title
            date(formatString: "MMMM DD, YYYY")
            slug
            type
            example
          }
        }
      }
    }
  }
`

export default BlogPostsPage