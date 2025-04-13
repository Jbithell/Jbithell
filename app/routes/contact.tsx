import { Button, Card, Text } from "@mantine/core";
import {
  IconArrowLeft,
  IconBrandMessenger,
  IconMail,
} from "@tabler/icons-react";
import React from "react";
import { href, Link } from "react-router";
import { HeaderFooterNav } from "../components/navigation/HeaderFooterNav";
import type { Route } from "./+types/contact";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Contact" },
    { name: "description", content: "Contact James Bithell" },
  ];
}
export default function Page({ loaderData }: Route.ComponentProps) {
  return (
    <HeaderFooterNav footer={false}>
      <Card withBorder padding="xl" radius="md">
        <Text ta="center" fz="xl" fw={500} mt="sm">
          James Bithell
        </Text>
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
