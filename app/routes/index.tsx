import { Avatar, Button, Card, Center, Text } from "@mantine/core";
import {
  IconBrandGithub,
  IconBrandLinkedin,
  IconMail,
  IconMasksTheater,
} from "@tabler/icons-react";
import React from "react";
import { Link } from "react-router";
import type { Route } from "./+types/index";
import { HeaderFooterNav } from "./../components/navigation/HeaderFooterNav";

export function meta({}: Route.MetaArgs) {
  return [{ title: "James Bithell" }];
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return (
    <HeaderFooterNav footer={false}>
      <Center>
        <Card withBorder padding="xl" radius="md">
          <Avatar
            src={"/images/james-bithell-profile.jpg"}
            size={140}
            radius={80}
            mx="auto"
            alt="Profile Image of James Bithell smiling"
          />
          <Text ta="center" fz="xl" fw={500} mt="sm">
            James Bithell
          </Text>
          <Text ta="center" fz="md" c="dimmed">
            London, United Kingdom
          </Text>
          <Button
            fullWidth
            component={Link}
            to="/contact"
            radius="md"
            mt="md"
            size="md"
            variant="default"
            justify="space-between"
            rightSection={<IconMail />}
          >
            Contact
          </Button>
          <Button
            fullWidth
            component={Link}
            to="https://www.linkedin.com/in/jbithell/"
            target="_blank"
            radius="md"
            mt="xs"
            size="md"
            variant="default"
            justify="space-between"
            rightSection={<IconBrandLinkedin />}
          >
            CV
          </Button>
          <Button
            fullWidth
            radius="md"
            to="https://github.com/jbithell"
            target="_blank"
            component={Link}
            mt="xs"
            size="md"
            variant="default"
            justify="space-between"
            rightSection={<IconBrandGithub />}
          >
            Development Portfolio
          </Button>

          <Button
            fullWidth
            radius="md"
            component={Link}
            to="/events"
            mt="xs"
            size="md"
            variant="default"
            justify="space-between"
            rightSection={<IconMasksTheater />}
          >
            Event Portfolio
          </Button>
        </Card>
      </Center>
    </HeaderFooterNav>
  );
}
