const path = require("path")

exports.createPages = async ({ actions, graphql, reporter }) => {
  const { createPage } = actions

  const types = {
    blog: {
      template: path.resolve("src/templates/blog.js"),
      path: "posts/"
    },
    page: {
      template: path.resolve("src/templates/page.js"),
      path: ""
    },
    liveEvent: {
      template: path.resolve("src/templates/liveEvent.js"),
      path: "events/"
    }
  }
  
  const result = await graphql(`
    {
      allMarkdownRemark(
        sort: { order: DESC, fields: [frontmatter___date] }
        limit: 10000
      ) {
        edges {
          node {
            frontmatter {
              slug
              type
              example
            }
          }
        }
      }
    }
  `)

  if (result.errors) {
    reporter.panicOnBuild(`Error while running GraphQL query.`)
    return
  }

  result.data.allMarkdownRemark.edges.forEach(({ node }) => {
    if (node.frontmatter.example !== true && types[node.frontmatter.type]) { //Examples aren't rendered
      let thisType = types[node.frontmatter.type]
      createPage({
        path: thisType.path + node.frontmatter.slug,
        component: thisType.template,
        context: {
          type: node.frontmatter.type,
          slug: node.frontmatter.slug
        } // additional data can be passed via context
      })
    }
    
  })
}