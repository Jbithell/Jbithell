import { Button, Card, Group, Image, Text } from "@mantine/core";
import {
  IconArrowLeft,
  IconBuildingBank,
  IconMapPin,
  IconUserCircle,
} from "@tabler/icons-react";
import * as React from "react";
import { Link } from "react-router";
import eventPortfolio from "../../eventPortfolio.json";
import { HeaderFooterNav } from "../components/navigation/HeaderFooterNav";
import { getPortfolioImage } from "../portfolioImages.server";
import { breadcrumbs, pageMeta, SITE_NAME } from "../seo";
import type { EventPortfolioObject } from "../types.d";
import type { Route } from "./+types/event";

export async function loader({ params }: Route.LoaderArgs) {
  const events = eventPortfolio as EventPortfolioObject[];
  const event = events.find((event) => event.slug === params.eventSlug);
  if (!event) {
    throw new Response("Not Found", { status: 404 });
  }
  return { event, image: getPortfolioImage(event.featuredImage) };
}

export function meta({ data }: Route.MetaArgs) {
  if (!data) return [];
  const { event, image } = data;
  const path = `/events/${event.slug}`;
  const roles = event.roles.join(", ");
  const venue = event.venue ? `. Venue: ${event.venue}` : "";
  return pageMeta({
    title: `${event.name} | ${SITE_NAME}`,
    description: `${event.name} (${event.date}) in James Bithell's live events portfolio. Roles: ${roles}${venue}`,
    path,
    image: image?.og,
    imageAlt: image ? `Photo from ${event.name}` : undefined,
    jsonLd: [
      breadcrumbs([
        { name: SITE_NAME, path: "/" },
        { name: "Event Portfolio", path: "/events" },
        { name: event.name, path },
      ]),
    ],
  });
}

export default function Page({ loaderData }: Route.ComponentProps) {
  const { event, image } = loaderData;
  return (
    <HeaderFooterNav
      footer={true}
      background={false}
      headerTitle={event.name}
      headerLeftSection={
        <Button
          visibleFrom="sm"
          radius="md"
          variant="default"
          component={Link}
          to="/events"
          justify="space-between"
          leftSection={<IconArrowLeft size={18} />}
          rightSection={<span />}
        >
          Back
        </Button>
      }
      headerRightSection={
        <Text size="lg" mr="sm" fw={600} visibleFrom="sm">
          {event.date}
        </Text>
      }
    >
      <Card withBorder radius="md" w={{ base: "100%", sm: "60%", md: "50%" }}>
        {image && (
          <Card.Section>
            <Image
              src={image.src}
              srcSet={image.srcSet}
              sizes="(min-width: 62em) 50vw, (min-width: 48em) 60vw, 100vw"
              width={image.width}
              height={image.height}
              h="auto"
              fetchPriority="high"
              alt={`Photo from ${event.name}`}
            />
          </Card.Section>
        )}
        {event.imageCredit && (
          <Text fz="sm" c="dimmed" mt="xs">
            Image Credit: {event.imageCredit}
          </Text>
        )}
        <Text size="lg" hiddenFrom="sm" mt="sm">
          {event.date}
        </Text>
        <Text mt="xs">
          Roles:{" "}
          {event.roles.map((role, i) => {
            return (i > 0 ? " | " : "") + role;
          })}
        </Text>

        {event.venue && (
          <Group justify="left" mt="xs">
            <IconMapPin size={24} />
            <Text fz="sm" inline>
              {event.venue}
            </Text>
          </Group>
        )}
        {event.client && (
          <Group justify="left" mt="xs">
            <IconBuildingBank size={24} />
            <Text fz="sm" inline>
              For {event.client}
            </Text>
          </Group>
        )}
        {event.director && (
          <Group justify="left" mt="xs">
            <IconUserCircle size={24} />
            <Text fz="sm" inline>
              Directed by {event.director}
            </Text>
          </Group>
        )}
        {event.author && (
          <Group justify="left" mt="xs">
            <IconUserCircle size={24} />
            <Text fz="sm" inline>
              Written by {event.author}
            </Text>
          </Group>
        )}
      </Card>
    </HeaderFooterNav>
  );
}
