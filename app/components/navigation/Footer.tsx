import { Box, Button, Center, Container, Group, Text } from "@mantine/core";
import { IconMail } from "@tabler/icons-react";
import React from "react";
import { Link } from "react-router";

const CopyrightText = () => {
  return (
    <Text fz="lg">
      &copy;2014-{new Date().getFullYear()}{" "}
      <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
        James Bithell
      </Link>
    </Text>
  );
};
export function Footer() {
  return (
    <Container size="xl">
      <Box hiddenFrom="sm">
        <Center mt="md" mb="md">
          <CopyrightText />
        </Center>
      </Box>
      <Box visibleFrom="sm">
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
      </Box>
    </Container>
  );
}
