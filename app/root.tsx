import {
  Button,
  ColorSchemeScript,
  Container,
  Group,
  Text,
  Title,
} from "@mantine/core";
// Only the styles for components in use, rather than all of @mantine/core/styles.css
import "@mantine/core/styles/baseline.css";
import "@mantine/core/styles/default-css-variables.css";
import "@mantine/core/styles/global.css";
import "@mantine/core/styles/AppShell.css";
import "@mantine/core/styles/AspectRatio.css";
import "@mantine/core/styles/Avatar.css";
import "@mantine/core/styles/Center.css";
import "@mantine/core/styles/Container.css";
import "@mantine/core/styles/Group.css";
import "@mantine/core/styles/Image.css";
import "@mantine/core/styles/Paper.css";
import "@mantine/core/styles/Card.css";
import "@mantine/core/styles/SimpleGrid.css";
import "@mantine/core/styles/Text.css";
import "@mantine/core/styles/Title.css";
import "@mantine/core/styles/UnstyledButton.css";
import "@mantine/core/styles/Button.css";
import React from "react";
import {
  isRouteErrorResponse,
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import type { Route } from "./+types/root";
import classes from "./components/ErrorBoundary.module.css";
import { MantineProviderWrapper } from "./components/theme";

export const links: Route.LinksFunction = () => [
  { rel: "icon", href: "/favicon.ico", sizes: "48x48" },
  { rel: "icon", href: "/icon.svg", type: "image/svg+xml" },
  { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
  { rel: "manifest", href: "/manifest.webmanifest" },
  { rel: "sitemap", type: "application/xml", href: "/sitemap.xml" },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="color-scheme" content="light dark" />
        <meta
          name="theme-color"
          media="(prefers-color-scheme: light)"
          content="#ffffff"
        />
        <meta
          name="theme-color"
          media="(prefers-color-scheme: dark)"
          content="#242424"
        />
        <Meta />
        <Links />
        <ColorSchemeScript defaultColorScheme="auto" />
      </head>
      <body>
        <MantineProviderWrapper>{children}</MantineProviderWrapper>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Error";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404 - Page not found" : "Error";
    details =
      error.status === 404
        ? "Unfortunately, the page you requested could not be found. You may have mistyped the address, or the page has been moved to another URL."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }
  console.log(error); // Send error to CF workers dashboard

  return (
    <Container className={classes.root}>
      <Title className={classes.title}>{message}</Title>
      <Text c="dimmed" size="lg" ta="center" className={classes.details}>
        {process.env.NODE_ENV !== "production"
          ? `${stack} ${details}`
          : details}
      </Text>
      <Group justify="center">
        <Button
          variant="subtle"
          size="md"
          component={Link}
          to="/"
          reloadDocument
        >
          Take me back to home page
        </Button>
      </Group>
    </Container>
  );
}
