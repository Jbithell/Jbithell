import { Button, Card, Group, Image, Text, useMatches } from "@mantine/core";
import { useViewportSize } from "@mantine/hooks";
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
import { EventPortfolioObject } from "../types.d";
import type { Route } from "./+types/event";

export async function loader({ params }: Route.LoaderArgs) {
  const events = eventPortfolio as EventPortfolioObject[];
  const event = events.find((event) => event.slug === params.eventSlug);
  if (!event) {
    throw new Response("Not Found", { status: 404 });
  }
  return { event };
}

export function meta({ data }: Route.MetaArgs) {
  return [
    { title: `${data.event.name} | James Bithell` },
    {
      name: "description",
      content: `Details of the event ${data.event.name} in James Bithell's live events Portfolio`,
    },
  ];
}

export default function Page({ loaderData }: Route.ComponentProps) {
  const { event } = loaderData;
  const { width } = useViewportSize();
  const imageWidth = useMatches({
    base: "100%",
    sm: width * 0.6,
    md: width * 0.5,
    lg: width * 0.5,
    xl: width * 0.5,
  });
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
      <Card withBorder radius="md" style={{ maxWidth: imageWidth }}>
        {event.featuredImage && (
          <Card.Section>
            <a>
              <Image
                src={"/images/portfolio/" + event.featuredImage}
                width={imageWidth}
                loading="eager"
                style={{ width: imageWidth }}
              />
            </a>
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
