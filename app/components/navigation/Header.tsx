import { Container, Group, Title } from "@mantine/core";
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
          <Title order={1} fz="xl" fw={600}>
            {title}
          </Title>
          {rightSection ?? <span />}
        </Group>
      </Container>
    </>
  );
}
