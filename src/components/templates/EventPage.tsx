import { Text } from "@mantine/core";
import { type HeadFC, type PageProps } from "gatsby";
import * as React from "react";
import { SEO } from "../../components/SEO";
import { EventPortolioObject } from "../../types";
import Layout from "../navigation/Layout";
const Page: React.FC<PageProps> = ({ pageContext }) => {
  const { event } = pageContext as { event: EventPortolioObject };
  return (
    <Layout footer={true}>
      <Text>{event.date}</Text>
    </Layout>
  );
};

export default Page;

export const Head: HeadFC = ({ pageContext }) => {
  const { event } = pageContext as { event: EventPortolioObject };
  return <SEO title={`${event.name} | Live Events Portfolio`} />;
};
