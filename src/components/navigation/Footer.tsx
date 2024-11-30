import {
  Button,
  Center,
  Container,
  Group,
  Modal,
  Text,
  useMatches,
} from "@mantine/core";
import React from "react";
import { Link } from "gatsby";
import { useBuildDate } from "../../hooks/use-build-date";
import { IconMail } from "@tabler/icons-react";

const CopyrightText = () => {
  const buildYear = useBuildDate();
  return (
    <Text fz="lg">
      &copy;2014-{buildYear}{" "}
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
            <Link
              to="/contact"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Button
                radius="md"
                variant="default"
                justify="space-between"
                rightSection={<IconMail size={18} />}
                leftSection={<span />}
              >
                Contact
              </Button>
            </Link>
            <CopyrightText />
          </Group>
        </Container>
      </>
    );
}
