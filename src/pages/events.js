import { Link, graphql } from "gatsby"
import * as React from "react"
import { GatsbyImage, getImage } from "gatsby-plugin-image"

import Template from "../components/Template"

const skills = [
  {
    name: "Sound",
    tag: "Sound",
    description: "Theatrical & live event front-of-house engineer with experience line-by-line mixing musical theatre and associated sound design. Experience of Allen&Heath dLive/SQ, Digico SD Series and Yamaha."
  },
  {
    name: "Lighting",
    tag: "Lighting",
    description: "Lighting design, programming and operation for theatre and live events, including busking. Experience in ETC EOS (including with Augment3d)"
  },
  {
    name: "Video",
    tag: "Video",
    description: "Experienced vision mixer and director, both in live and documentary formats. Experience with Blackmagic vision mixers, as well as Premiere Pro and Vegas"
  },
  {
    name: "Production",
    tag: "Production"
  },
  {
    name: "Stage Management",
    tag: "Stage Management"
  },
  {
    name: "Rigging & Automation",
    tag: "Automation"
  }
]

const CreditsPage = ({data}) => {
  const { edges: posts } = data.allMarkdownRemark
  const [skillFilter, setSkillFilter] = React.useState(null);
  const [showImagePostsOnly, setShowImagePostsOnly] = React.useState(true);
  const allPosts = posts.filter(post => post.node.frontmatter.type === "liveEvent" && post.node.frontmatter.example !== true && (skillFilter ? post.node.frontmatter.Tags.includes(skillFilter) : true));
  let thesePosts = []
  if (showImagePostsOnly) thesePosts = allPosts.filter(post => post.node.frontmatter.featuredImage);
  else thesePosts = allPosts

  const handleSkillClick = tag => {
    if (skillFilter === tag) {
      setSkillFilter(null);
      setShowImagePostsOnly(true);
    } else {
      setSkillFilter(tag);
      setShowImagePostsOnly(false);
    }    
  }
  return (
    <Template>
      <div className="px-6 py-10 text-center">
        <h3 className="text-4xl font-semibold leading-normal text-gray-800 mb-2">
        Event Portfolio {skillFilter ? `- ${skillFilter} Roles` : ""}
        </h3>
        <div class="grid md:grid-cols-3 gap-4 my-4">
          {skills.map((skill) => {
            return (
              <div className={"bg-white shadow overflow-hidden sm:rounded-lg " + (skill.tag === skillFilter ? 'bg-gray-300' : 'bg-gray-100')} onClick={() => handleSkillClick(skill.tag)}>
                <div className="px-4 py-5 sm:px-6">
                  <h2 className="text-xl leading-6 font-medium text-gray-900">{skill.name}</h2>
                  { skill.description ? (<p className="mt-1 max-w-2xl text-sm text-gray-500">{skill.description}</p>) : null }
                </div>
              </div>
            )
          })}
        </div>
        <p className="my-2 text-right font-light">
          { showImagePostsOnly ? (<>{`Showcasing ${thesePosts.length} event${thesePosts.length !== 1 ? "s":""} of ${allPosts.length} in total. `}<div className="inline" onClick={() => setShowImagePostsOnly(false)}>Show all</div></>) : `${thesePosts.length} event${thesePosts.length !== 1 ? "s":""}`}
          {}
        </p>
        <div class="grid md:grid-cols-3 auto-rows-min gap-4">
          {thesePosts.map(({ node: post }) => {
            let image = post.frontmatter.featuredImage ? getImage(post.frontmatter.featuredImage) : false
            return (
              <div class="bg-white shadow-lg rounded-lg hover:shadow-xl transition duration-200">
                <Link to={`/events/${post.frontmatter.slug}`}>
                  { image ? (<GatsbyImage class="rounded-t-lg max-h-80" image={image} alt={`${post.frontmatter.Name} | Credit: ${post.frontmatter.ImageCredit}`} />) : null }
                  <div class="py-4 px-8">
                    <h1 class="hover:cursor-pointer mt-2 text-gray-900 font-bold text-2xl tracking-tight">{post.frontmatter.Name}</h1>
                    <p class="hover:cursor-pointer py-3 text-gray-600 leading-6">{(post.frontmatter.Date).replaceAll("-"," ")}</p>
                  </div>
                </Link>
              </div>
            )
          })}
          
        </div>
      </div>
    </Template>
  )
}

export const pageQuery = graphql`
  query eventPostQuery {
    allMarkdownRemark(sort: { order: DESC, fields: [frontmatter___date] }) {
      edges {
        node {
          excerpt(pruneLength: 250)
          id
          frontmatter {
            slug
            type
            example
            Name
            date(formatString: "dddd DD MMMM YYYY")
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
    }
  }
`

export default CreditsPage