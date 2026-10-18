import { Button, Card, Text, Title } from "@mantine/core";
import {
  IconArrowLeft,
  IconBrandMessenger,
  IconMail,
} from "@tabler/icons-react";
import React from "react";
import { href, Link } from "react-router";
import { HeaderFooterNav } from "../components/navigation/HeaderFooterNav";
import { pageMeta, SITE_NAME } from "../seo";
import type { Route } from "./+types/contact";

export function meta({}: Route.MetaArgs) {
  return pageMeta({
    title: `Contact | ${SITE_NAME}`,
    description:
      "Contact James Bithell by email at hi@jbithell.com or on Facebook Messenger",
    path: "/contact",
  });
}
export default function Page({ loaderData }: Route.ComponentProps) {
  return (
    <HeaderFooterNav footer={false}>
      <Card withBorder padding="xl" radius="md">
        <Title order={1} ta="center" fz="xl" fw={500} mt="sm">
          James Bithell
        </Title>
        <Text ta="center" fz="md" c="dimmed">
          Contact
        </Text>

        <Button
          fullWidth
          radius="md"
          to="https://m.me/bithellj"
          target="_blank"
          component={Link}
          mt="md"
          size="md"
          variant="default"
          justify="space-between"
          rightSection={<IconBrandMessenger />}
        >
          Facebook Messenger
        </Button>

        <Button
          fullWidth
          component={Link}
          to="mailto:hi@jbithell.com"
          target="_blank"
          radius="md"
          mt="xs"
          size="md"
          variant="default"
          justify="space-between"
          rightSection={<IconMail />}
        >
          hi@jbithell.com
        </Button>

        <Button
          fullWidth
          radius="md"
          size="md"
          mt="xs"
          variant="default"
          justify="space-between"
          rightSection={<IconArrowLeft />}
          component={Link}
          to={href("/")}
        >
          Back
        </Button>
      </Card>
    </HeaderFooterNav>
  );
}
