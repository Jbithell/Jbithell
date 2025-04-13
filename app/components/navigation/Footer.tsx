import {
  Button,
  Center,
  Container,
  Group,
  Text,
  useMatches,
} from "@mantine/core";
import { IconMail } from "@tabler/icons-react";
import React from "react";
import { Link } from "react-router";

const CopyrightText = () => {
  return (
    <Text fz="lg">
      &copy;2014-{2025}{" "}
      <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
        James Bithell
      </Link>
    </Text>
  );
};
export function Footer() {
  const desktopFooter = useMatches({
    base: false,
    sm: true,
  });
  if (!desktopFooter)
    return (
      <>
        <Container size="xl">
          <Center mt="md" mb="md">
            <CopyrightText />
          </Center>
        </Container>
      </>
    );
  else
    return (
      <>
        <Container size="xl">
          <Group justify="space-between" align="center" mt="sm" mb="md">
            <Button
              radius="md"
              component={Link}
              to="/contact"
              variant="default"
              justify="space-between"
              rightSection={<IconMail size={18} />}
              leftSection={<span />}
            >
              Contact
            </Button>
            <CopyrightText />
          </Group>
        </Container>
      </>
    );
}
