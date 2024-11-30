import { Text } from "@mantine/core";
import { Link, type HeadFC, type PageProps } from "gatsby";
import * as React from "react";
import { SEO } from "../SEO";
import { EventPortolioObject } from "../../types";
import Layout from "../navigation/Layout";
const Page: React.FC<PageProps> = ({ pageContext }) => {
  const { events } = pageContext as { events: EventPortolioObject[] };
  return (
    <Layout footer={true} title={"Event Portfolio"} backButtonUrl="/">
      {events.map((event) => (
        <Link to={"/events/" + event.slug} key={event.name}>
          {event.name}
        </Link>
      ))}
    </Layout>
  );
};

export default Page;

export const Head: HeadFC = ({ pageContext }) => {
  return <SEO title="Live Events Portfolio" />;
};
