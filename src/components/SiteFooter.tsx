import { Anchor, Box, Container, Group, Text } from "@mantine/core";
import { Mantine } from "./Mantine";

export function SiteFooter({
  siteTitle,
  links,
}: {
  siteTitle: string;
  links: { href: string; label: string; rel?: string }[];
}) {
  return (
    <Mantine>
      <Box
        component="footer"
        py="xl"
        mt="xl"
        style={{ borderTop: "1px solid var(--mantine-color-default-border)" }}
      >
        <Container size="lg">
          <Group justify="space-between" gap="md">
            <Text size="sm" c="dimmed">
              &copy; 2014–{new Date().getFullYear()} {siteTitle}
            </Text>
            <Group gap="md" component="nav" aria-label="Footer">
              {links.map((link) => (
                <Anchor key={link.href} href={link.href} rel={link.rel} size="sm" c="dimmed">
                  {link.label}
                </Anchor>
              ))}
            </Group>
          </Group>
        </Container>
      </Box>
    </Mantine>
  );
}
