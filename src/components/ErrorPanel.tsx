import { Button, Container, Group, Text, Title } from "@mantine/core";
import { Mantine } from "./Mantine";

export function ErrorPanel({
  code,
  title,
  message,
}: {
  code: string;
  title: string;
  message: string;
}) {
  return (
    <Mantine>
      <Container size="sm" py={80} ta="center">
        <Text fz={96} fw={900} lh={1} c="dimmed" aria-hidden="true">
          {code}
        </Text>
        <Title order={1} mt="md">
          {title}
        </Title>
        <Text c="dimmed" size="lg" mt="md">
          {message}
        </Text>
        <Group justify="center" mt="xl">
          <Button component="a" href="/" size="md">
            Home
          </Button>
          <Button component="a" href="/portfolio" size="md" variant="default">
            Event Portfolio
          </Button>
        </Group>
      </Container>
    </Mantine>
  );
}
