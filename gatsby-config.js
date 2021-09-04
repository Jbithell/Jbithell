module.exports = {
  siteMetadata: {
    siteUrl: "https://jbithell.com",
    title: "James Bithell",
    personalDetails: {
      name: "James Bithell",
      location: "London, United Kingdom",
      company: {
        jobTitle: "",
        name: "",
        url: ""
      }
    }
  },
  plugins: [
    "gatsby-plugin-image",
    {
      resolve: "gatsby-plugin-google-analytics",
      options: {
        trackingId: "UA-26373319-4",
      },
    },
    "gatsby-plugin-react-helmet",
    "gatsby-plugin-sitemap",
    {
      resolve: "gatsby-plugin-manifest",
      options: {
        name: "James Bithell",
        short_name: "JBithell",
        description: "Website for James Bithell",
        start_url: "/",
        background_color: "#f7f0eb",
        theme_color: "#fd93cc",
        display: "standalone",
        icon: "src/assets/img/icon.png",
        icon_options: {
          purpose: "any maskable",
        },
        cache_busting_mode: "none",
      },
    },
    "gatsby-transformer-remark",
    "gatsby-plugin-sharp",
    "gatsby-transformer-sharp",
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "images",
        path: "./src/assets/img/",
      },
      __key: "images",
    },
    {
      resolve: "gatsby-transformer-remark",
      options: {
        // Footnotes mode (default: true)
        footnotes: true,
        // GitHub Flavored Markdown mode (default: true)
        gfm: true,
        // Plugins configs
        plugins: [{
          resolve: "gatsby-remark-images",
          options: {
            maxWidth: 800,
          },
        }],
      },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "pages",
        path: `${__dirname}/src/posts/`,
      },
      __key: "pages",
    },
    "gatsby-plugin-postcss",
  ],
};
