import {
  Anchor,
  Badge,
  Button,
  Container,
  DataList,
  Grid,
  Group,
  Image,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  Title,
  Typography,
} from "@mantine/core";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import type { ReactNode } from "react";
import type { ResponsiveImage } from "../lib/images";
import { Mantine } from "./Mantine";
import { BreadcrumbNav, type Crumb } from "./PageHeader";

export interface EventDetailData {
  title: string;
  dateLabel: string;
  dateTime: string;
  image: ResponsiveImage | null;
  imageCredit?: { label: string; href?: string };
  disciplines: { label: string; href: string }[];
  roles: { label: string; href: string }[];
  facts: { label: string; value: string }[];
  previous?: { title: string; href: string };
  next?: { title: string; href: string };
}

export function EventDetail({
  event,
  breadcrumbs,
  children,
}: {
  event: EventDetailData;
  breadcrumbs: Crumb[];
  children?: ReactNode;
}) {
  const details = (
    <Stack gap="lg">
      <div>
        <Title order={1}>{event.title}</Title>
        <Text
          component="time"
          dateTime={event.dateTime}
          size="lg"
          c="dimmed"
          mt={4}
          display="block"
        >
          {event.dateLabel}
        </Text>
        {event.disciplines.length > 0 && (
          <Group gap="xs" mt="sm">
            {event.disciplines.map((discipline) => (
              <Badge
                key={discipline.href}
                component="a"
                href={discipline.href}
                variant="light"
                size="lg"
                style={{ cursor: "pointer" }}
              >
                {discipline.label}
              </Badge>
            ))}
          </Group>
        )}
      </div>
      <DataList withDivider labelWidth={140}>
        {event.roles.length > 0 && (
          <DataList.Item>
            <DataList.ItemLabel>{event.roles.length > 1 ? "Roles" : "Role"}</DataList.ItemLabel>
            <DataList.ItemValue>
              {event.roles.map((role, i) => (
                <span key={role.href}>
                  {i > 0 && ", "}
                  <Anchor href={role.href} inherit underline="always">
                    {role.label}
                  </Anchor>
                </span>
              ))}
            </DataList.ItemValue>
          </DataList.Item>
        )}
        {event.facts.map((fact) => (
          <DataList.Item key={fact.label}>
            <DataList.ItemLabel>{fact.label}</DataList.ItemLabel>
            <DataList.ItemValue>{fact.value}</DataList.ItemValue>
          </DataList.Item>
        ))}
      </DataList>
      {children && <Typography>{children}</Typography>}
    </Stack>
  );

  return (
    <Mantine>
      <Container size="lg" pt="xl" pb="lg">
        <BreadcrumbNav breadcrumbs={breadcrumbs} />
        {event.image ? (
          <Grid gap="xl">
            <Grid.Col span={{ base: 12, md: 7 }}>
              <figure style={{ margin: 0 }}>
                <Paper withBorder radius="md" style={{ overflow: "hidden" }}>
                  <Image
                    src={event.image.src}
                    srcSet={event.image.srcSet}
                    sizes={event.image.sizes}
                    width={event.image.width}
                    height={event.image.height}
                    alt={event.image.alt}
                    fetchPriority="high"
                    decoding="async"
                    h="auto"
                    style={event.image.style}
                  />
                </Paper>
                {event.imageCredit && (
                  <Text component="figcaption" size="sm" c="dimmed" mt="xs">
                    Photo:{" "}
                    {event.imageCredit.href ? (
                      <Anchor
                        href={event.imageCredit.href}
                        inherit
                        rel="noopener"
                        underline="always"
                      >
                        {event.imageCredit.label}
                      </Anchor>
                    ) : (
                      event.imageCredit.label
                    )}
                  </Text>
                )}
              </figure>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 5 }}>{details}</Grid.Col>
          </Grid>
        ) : (
          <div style={{ maxWidth: 720 }}>{details}</div>
        )}

        {(event.previous || event.next) && (
          <SimpleGrid component="nav" aria-label="More events" cols={{ base: 1, sm: 2 }} mt="xl">
            {event.next ? (
              <Button
                component="a"
                href={event.next.href}
                variant="default"
                size="lg"
                justify="flex-start"
                leftSection={<IconArrowLeft size={20} aria-hidden="true" />}
                styles={{ label: { whiteSpace: "normal", overflow: "hidden" } }}
                h="auto"
                py="sm"
              >
                <span>
                  <Text span size="xs" c="dimmed" display="block">
                    Newer
                  </Text>
                  {event.next.title}
                </span>
              </Button>
            ) : (
              <span />
            )}
            {event.previous && (
              <Button
                component="a"
                href={event.previous.href}
                variant="default"
                size="lg"
                justify="flex-end"
                rightSection={<IconArrowRight size={20} aria-hidden="true" />}
                styles={{ label: { whiteSpace: "normal", overflow: "hidden", textAlign: "right" } }}
                h="auto"
                py="sm"
              >
                <span>
                  <Text span size="xs" c="dimmed" display="block">
                    Older
                  </Text>
                  {event.previous.title}
                </span>
              </Button>
            )}
          </SimpleGrid>
        )}
      </Container>
    </Mantine>
  );
}
