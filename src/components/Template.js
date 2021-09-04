import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

import { StaticQuery, graphql } from "gatsby"
import { Helmet } from "react-helmet"

import background from "./../assets/img/backgrounds/wales1-min.jpg"

export default function Template(props) {
  return (
    <>
      <StaticQuery
        query={graphql`
          query SiteDetailsQuery {
            site {
              siteMetadata {
                siteUrl
                title
              }
            }
          }
        `}
        render={data => (
          <Helmet htmlAttributes={{ lang: "en" }}>
            <meta charSet="utf-8" />
            <meta name="description" content="Personal website for James Bithell"/>
            <title>{data.site.siteMetadata.title}</title>
            <link rel="canonical" href={data.site.siteMetadata.siteUrl} />
          </Helmet>
        )}
      />        
      <Navbar transparent />
      <main className="profile-page">
        <section className="relative block" style={{ height: props.smallBanner ? "300px" : "600px" }}>
          <div
            className="absolute top-0 w-full h-full bg-center bg-cover"
            style={{
              backgroundImage: `url(${background})`
            }}
          >
            <span
              id="blackOverlay"
              className="w-full h-full absolute opacity-50 bg-black"
            ></span>
          </div>
          <div
            className="top-auto bottom-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden"
            style={{ height: "70px" }}
          >
            <svg
              className="absolute bottom-0 overflow-hidden"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
              version="1.1"
              viewBox="0 0 2560 100"
              x="0"
              y="0"
            >
              <polygon
                className="text-gray-300 fill-current"
                points="2560 0 2560 100 0 100"
              ></polygon>
            </svg>
          </div>
        </section>
        <section className="relative py-16 bg-gray-300">
          <div className="container mx-auto px-4">
            <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg -mt-64">
              <div>
                {props.children}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}