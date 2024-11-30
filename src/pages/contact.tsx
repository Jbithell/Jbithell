import { Button, Card, Center, Text } from "@mantine/core";
import { Link, navigate, type HeadFC, type PageProps } from "gatsby";
import * as React from "react";
import { SEO } from "../components/SEO";
import Layout from "../components/navigation/Layout";
import {
  IconArrowLeft,
  IconBrandFacebook,
  IconBrandMessenger,
  IconMail,
} from "@tabler/icons-react";
const Page: React.FC<PageProps> = () => {
  return (
    <Layout footer={false}>
      <Card withBorder padding="xl" radius="md">
        <Text ta="center" fz="xl" fw={500} mt="sm">
          James Bithell
        </Text>
        <Text ta="center" fz="md" c="dimmed">
          Contact
        </Text>

        <Link
          to="https://facebook.com/bithellj"
          target="_blank"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <Button
            fullWidth
            radius="md"
            mt="md"
            size="md"
            variant="default"
            justify="space-between"
            rightSection={<IconBrandMessenger />}
          >
            Facebook Messenger
          </Button>
        </Link>
        <Link
          to="mailto:hi@jbithell.com"
          target="_blank"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <Button
            fullWidth
            radius="md"
            mt="xs"
            size="md"
            variant="default"
            justify="space-between"
            rightSection={<IconMail />}
          >
            hi@jbithell.com
          </Button>
        </Link>

        <Button
          fullWidth
          radius="md"
          size="md"
          mt="xs"
          variant="default"
          justify="space-between"
          rightSection={<IconArrowLeft />}
          onClick={() => navigate(-1)}
        >
          Back
        </Button>
      </Card>
    </Layout>
  );
};

export default Page;

export const Head: HeadFC = () => (
  <SEO title="Contact" description="Contact James Bithell" />
);
