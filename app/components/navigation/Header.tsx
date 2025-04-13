import { Container, Group, Text } from "@mantine/core";
import React from "react";

export function Header({
  leftSection,
  rightSection,
  title,
}: {
  leftSection: React.ReactNode;
  rightSection: React.ReactNode;
  title: string;
}) {
  return (
    <>
      <Container size="xl">
        <Group justify="space-between" align="center" mt="sm" mb="md">
          {leftSection ?? <span />}
          <Text size="xl" fw={600}>
            {title}
          </Text>
          {rightSection ?? <span />}
        </Group>
      </Container>
    </>
  );
}
