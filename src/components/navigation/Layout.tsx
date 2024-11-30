import {
  AppShell,
  Box,
  Center,
  Container,
  Group,
  Title,
  useMatches,
} from "@mantine/core";
import React from "react";
import { Footer } from "./Footer";
import { useViewportSize } from "@mantine/hooks";

export default function Layout({
  children,
  footer,
  title,
  backButtonUrl,
}: {
  children: React.ReactNode;
  footer: boolean;
  backButtonUrl?: string;
  title?: string;
}) {
  const { height } = useViewportSize();
  const showHeader = backButtonUrl && title;
  const showFooter = footer;
  return (
    <AppShell
      header={{ height: showHeader ? 60 : 0 }}
      footer={{ height: showFooter ? 60 : 0 }}
      padding="md"
    >
      {backButtonUrl && title ? (
        <AppShell.Header>
          <Container size="xl">
            <Group>
              <Center>
                <Box>
                  <Title order={1}>{title}</Title>
                </Box>
              </Center>
            </Group>
          </Container>
        </AppShell.Header>
      ) : null}
      <AppShell.Main>
        <Container size="xl">
          <Center
            style={{
              minHeight:
                height - ((showHeader ? 60 : 0) + (showFooter ? 60 : 0) + 32), // 32 accounts for some padding
            }}
          >
            {children}
          </Center>
        </Container>
      </AppShell.Main>
      {footer ? (
        <AppShell.Footer>
          <Footer />
        </AppShell.Footer>
      ) : null}
    </AppShell>
  );
}
