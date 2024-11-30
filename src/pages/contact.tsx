import { Card, Center, Text } from "@mantine/core";
import { type HeadFC, type PageProps } from "gatsby";
import * as React from "react";
import { SEO } from "../components/SEO";
import Layout from "../components/navigation/Layout";
const Page: React.FC<PageProps> = () => {
  return (
    <Layout footer={true} title="Contact" backButtonUrl="/">
      <Center>
        <Card withBorder padding="xl" radius="md">
          <Text ta="center" fz="xl" fw={500} mt="sm">
            James Bithell
          </Text>
          <Text ta="center" fz="md" c="dimmed">
            hi@jbithell.com
          </Text>
        </Card>
      </Center>
    </Layout>
  );
};

export default Page;

export const Head: HeadFC = () => (
  <SEO title="Contact" description="Contact James Bithell" />
);
