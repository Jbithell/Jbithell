import { Container, Stack, Title } from "@mantine/core";
import type { ReactNode } from "react";
import { Mantine } from "./Mantine";

/** A heading and its CV entries, which are rendered by Astro and passed as children */
export function CvSection({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <Mantine>
      <Container size="md" component="section" aria-labelledby={id} pb="xl">
        <Title order={2} id={id} mb="lg">
          {title}
        </Title>
        <Stack gap="xl">{children}</Stack>
      </Container>
    </Mantine>
  );
}
