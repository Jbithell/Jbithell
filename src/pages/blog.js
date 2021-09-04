import { Link, graphql } from "gatsby"
import * as React from "react"

import Template from "../components/Template"

const BlogPostsPage = ({data}) => {
  const { edges: posts } = data.allMarkdownRemark
  const thesePosts = posts.filter(post => (post.node.frontmatter.title.length > 0 && post.node.frontmatter.type === "blog" && post.node.frontmatter.showInList === true && post.node.frontmatter.example !== true))
  return (
    <Template>
      <div className="px-6 py-6 text-center">
        <h3 className="text-5xl font-semibold leading-normal text-gray-800 mb-2">
        Blog Posts
        </h3>
        { thesePosts.length < 1 ? (<h4 className="text-xl font-light text-gray-800 mb-1">No posts to show just yet</h4>) : null}
        <div className="flex flex-wrap justify-center">
          <div className="w-full lg:w-9/12 px-4">
          {thesePosts.map(({ node: post }) => {
            return (
              <div className="blog-post-preview" key={post.id}>
                <h1 className="text-3xl font-semibold text-gray-800 mb-1">
                  <Link to={`/posts/${post.frontmatter.slug}`}>{post.frontmatter.title}</Link>
                </h1>
                <h2 className="text-xl font-light text-gray-800 mb-1">{post.frontmatter.date}</h2>
                <p className="text-base text-gray-800">{post.excerpt}</p>
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
            date(formatString: "DD MMMM YYYY")
            slug
            type
            example
            showInList
          }
        }
      }
    }
  }
`

export default BlogPostsPage