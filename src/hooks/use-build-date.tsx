import { graphql, useStaticQuery } from "gatsby"

export const useBuildDate = () => {
  const buildYear = useStaticQuery(graphql`
    query {
      currentBuildDate {
        currentDate
      }
    }
  `)

  return buildYear.currentBuildDate.currentDate;
}