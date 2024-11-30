import type { GatsbyConfig } from "gatsby";

const config: GatsbyConfig = {
  siteMetadata: {
    siteUrl: "https://jbithell.com",
    title: "James Bithell",
    titleTemplate: "%s | James Bithell",
    description:
      "Personal website of James Bithell, a software engineer based in London, UK.",
    author: "jbithell",
  },
  // More easily incorporate content into your pages through automatic TypeScript type generation and better GraphQL IntelliSense.
  // If you use VSCode you can also use the GraphQL plugin
  // Learn more at: https://gatsby.dev/graphql-typegen
  graphqlTypegen: true,
  plugins: [
    "gatsby-plugin-postcss",
    "gatsby-plugin-sitemap",
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "pages",
        path: "./src/pages/",
      },
      __key: "pages",
    },
    {
      resolve: "gatsby-source-build-date",
      options: {
        locales: "en-GB",
        options: {
          year: "numeric",
        },
      },
    },
  ],
};

export default config;
