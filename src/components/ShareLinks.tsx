import { Anchor, Badge, Button, Container, Group, Paper, Stack, Text, Title } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { Mantine } from "./Mantine";

export interface ShareLinkData {
  title: string;
  url: string;
  editHref: string;
  /** e.g. "Expires 1 March 2027" or "Expired 1 March 2027" */
  expiry?: string;
  expired: boolean;
}

/** Shown to signed-in editors on the private CV, to copy share links and create new ones */
export function ShareLinks({
  links,
  newKey,
  newHref,
}: {
  links: ShareLinkData[];
  newKey: string;
  newHref: string;
}) {
  return (
    <Mantine>
      <Container size="md" pb="xl" className="no-print">
        <Paper withBorder p="lg" radius="md">
          <Group justify="space-between" align="center" mb="xs">
            <Title order={2} fz="h3">
              Share links
            </Title>
            <Button
              component="a"
              href={newHref}
              variant="light"
              leftSection={<IconPlus size={18} aria-hidden="true" />}
            >
              New link
            </Button>
          </Group>
          <Text size="sm" c="dimmed">
            Only you see this panel. Anyone with a link below can view this page until it expires
            or you unpublish it. For a new link, paste this key into the Key field:{" "}
            <Text span ff="monospace" c="var(--mantine-color-text)" style={{ userSelect: "all" }}>
              {newKey}
            </Text>
          </Text>
          {links.length > 0 && (
            <Stack gap="sm" mt="md">
              {links.map((link) => (
                <div key={link.url}>
                  <Group gap="xs">
                    <Anchor href={link.editHref} fw={500}>
                      {link.title}
                    </Anchor>
                    {link.expiry && (
                      <Badge variant="light" color={link.expired ? "red" : "gray"}>
                        {link.expiry}
                      </Badge>
                    )}
                  </Group>
                  <Text
                    size="sm"
                    ff="monospace"
                    style={{ userSelect: "all", overflowWrap: "anywhere" }}
                    td={link.expired ? "line-through" : undefined}
                  >
                    {link.url}
                  </Text>
                </div>
              ))}
            </Stack>
          )}
        </Paper>
      </Container>
    </Mantine>
  );
}
