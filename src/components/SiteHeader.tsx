import { ActionIcon, Anchor, Box, Button, Container, Group } from "@mantine/core";
import { IconMoon, IconSun } from "@tabler/icons-react";
import { Logo } from "./Logo";
import { Mantine } from "./Mantine";
import classes from "./SiteHeader.module.css";

// Short labels on small screens, so the navigation fits on a phone
const links = [
  { href: "/portfolio", label: "Event Portfolio", short: "Events" },
  { href: "/projects", label: "Projects Portfolio", short: "Projects" },
  { href: "/cv", label: "CV" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader({ siteTitle, path }: { siteTitle: string; path: string }) {
  return (
    <Mantine>
      <Box component="header" className={classes.header}>
        <Container size="lg">
          <Group justify="space-between" h={64} wrap="nowrap">
            <Anchor href="/" className={classes.brand} underline="never" aria-label={siteTitle}>
              <Logo size={26} />
              {/* Hidden on small phones to leave room for the navigation */}
              <Box component="span" visibleFrom="xs">
                {siteTitle}
              </Box>
            </Anchor>
            <Group gap={2} wrap="nowrap" component="nav" aria-label="Main">
              {links.map((link) => {
                const current = path === link.href || path.startsWith(link.href + "/");
                return (
                  <Button
                    key={link.href}
                    component="a"
                    href={link.href}
                    variant={current ? "light" : "subtle"}
                    color={current ? undefined : "gray"}
                    aria-current={current ? "page" : undefined}
                    px={10}
                  >
                    {link.short ? (
                      <>
                        <Box component="span" visibleFrom="md">
                          {link.label}
                        </Box>
                        <Box component="span" hiddenFrom="md">
                          {link.short}
                        </Box>
                      </>
                    ) : (
                      link.label
                    )}
                  </Button>
                );
              })}
              {/* Wired up by the inline script in Base.astro */}
              <ActionIcon
                id="color-scheme-toggle"
                variant="default"
                size="lg"
                ml={6}
                aria-label="Toggle dark mode"
                title="Toggle dark mode"
              >
                <IconMoon size={18} className={classes.moon} aria-hidden="true" />
                <IconSun size={18} className={classes.sun} aria-hidden="true" />
              </ActionIcon>
            </Group>
          </Group>
        </Container>
      </Box>
    </Mantine>
  );
}
