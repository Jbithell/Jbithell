import { Anchor, Breadcrumbs, Container, Text, Title } from "@mantine/core";
import type { ReactNode } from "react";
import { Mantine } from "./Mantine";

export interface Crumb {
  label: string;
  href: string;
}

export function PageHeader({
  title,
  description,
  breadcrumbs = [],
  children,
}: {
  title: string;
  description?: string;
  breadcrumbs?: Crumb[];
  children?: ReactNode;
}) {
  return (
    <Mantine>
      <Container size="lg" pt="xl" pb="lg">
        <BreadcrumbNav breadcrumbs={breadcrumbs} />
        <Title order={1}>{title}</Title>
        {description && (
          <Text size="lg" c="dimmed" mt="xs" maw={720}>
            {description}
          </Text>
        )}
        {children}
      </Container>
    </Mantine>
  );
}

/** Visible breadcrumb trail; the matching BreadcrumbList JSON-LD is added by Base.astro */
export function BreadcrumbNav({ breadcrumbs }: { breadcrumbs: Crumb[] }) {
  if (breadcrumbs.length === 0) return null;
  return (
    <nav aria-label="Breadcrumb">
      <Breadcrumbs separatorMargin={6} mb="sm" fz="sm">
        {breadcrumbs.map((crumb, i) =>
          i === breadcrumbs.length - 1 ? (
            <Text key={crumb.href} size="sm" c="dimmed" aria-current="page">
              {crumb.label}
            </Text>
          ) : (
            <Anchor key={crumb.href} href={crumb.href} size="sm">
              {crumb.label}
            </Anchor>
          ),
        )}
      </Breadcrumbs>
    </nav>
  );
}
