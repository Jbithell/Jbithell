import {
  Button,
  ColorSchemeScript,
  Container,
  Group,
  Text,
  Title,
} from "@mantine/core";
import "@mantine/core/styles.css";
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

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
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
