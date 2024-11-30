import { Avatar, Button, Card, Center, Text } from "@mantine/core";
import {
  IconBrandGithub,
  IconBrandLinkedin,
  IconMail,
  IconMasksTheater,
} from "@tabler/icons-react";
import { Link, type HeadFC, type PageProps } from "gatsby";
import * as React from "react";
import jamesImage from "../assets/img/james.jpg";
import { SEO } from "../components/SEO";
import Layout from "../components/navigation/Layout";
const Page: React.FC<PageProps> = () => {
  return (
    <Layout footer={false}>
      <Center>
        <Card withBorder padding="xl" radius="md">
          <Avatar src={jamesImage} size={120} radius={80} mx="auto" />
          <Text ta="center" fz="xl" fw={500} mt="sm">
            James Bithell
          </Text>
          <Text ta="center" fz="md" c="dimmed">
            London, United Kingdom
          </Text>
          <Link
            to="/contact"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <Button
              fullWidth
              radius="md"
              mt="md"
              size="md"
              variant="default"
              justify="space-between"
              rightSection={<IconMail />}
            >
              Contact
            </Button>
          </Link>
          <Link
            to="https://www.linkedin.com/in/jbithell/"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <Button
              fullWidth
              radius="md"
              mt="xs"
              size="md"
              variant="default"
              justify="space-between"
              rightSection={<IconBrandLinkedin />}
            >
              CV
            </Button>
          </Link>
          <Link
            to="https://github.com/jbithell"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <Button
              fullWidth
              radius="md"
              mt="xs"
              size="md"
              variant="default"
              justify="space-between"
              rightSection={<IconBrandGithub />}
            >
              Development Portfolio
            </Button>
          </Link>
          <Link
            to="/events"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <Button
              fullWidth
              radius="md"
              mt="xs"
              size="md"
              variant="default"
              justify="space-between"
              rightSection={<IconMasksTheater />}
            >
              Event Portfolio
            </Button>
          </Link>
        </Card>
      </Center>
    </Layout>
  );
};

export default Page;

export const Head: HeadFC = () => <SEO />;
