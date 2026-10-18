import {
  AspectRatio,
  Button,
  Card,
  Image,
  SimpleGrid,
  Text,
} from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import * as React from "react";
import { Link } from "react-router";
import eventPortfolio from "../../eventPortfolio.json";
import * as classes from "../components/EventsPage.module.css";
import { HeaderFooterNav } from "../components/navigation/HeaderFooterNav";
import { getPortfolioImage } from "../portfolioImages.server";
import { breadcrumbs, pageMeta, SITE_NAME } from "../seo";
import type { EventPortfolioObject } from "../types.d";
import type { Route } from "./+types/events";
export function meta({}: Route.MetaArgs) {
  return pageMeta({
    title: `Live Events Portfolio | ${SITE_NAME}`,
    description:
      "James Bithell's live events portfolio - theatre, concerts and events worked on since 2014",
    path: "/events",
    jsonLd: [
      breadcrumbs([
        { name: SITE_NAME, path: "/" },
        { name: "Event Portfolio", path: "/events" },
      ]),
    ],
  });
}

export async function loader({}: Route.LoaderArgs) {
  const events = (eventPortfolio as EventPortfolioObject[])
    .slice()
    .reverse()
    .map((event) => ({
      slug: event.slug,
      name: event.name,
      date: event.date,
      image: getPortfolioImage(event.featuredImage),
    }));
  return { events };
}

export default function Page({ loaderData }: Route.ComponentProps) {
  const { events } = loaderData;
  const [showAllEvents, setShowAllEvents] = React.useState(false);
  return (
    <HeaderFooterNav
      footer={true}
      background={false}
      headerTitle="Event Portfolio"
      headerLeftSection={
        <Button
          visibleFrom="sm"
          radius="md"
          variant="default"
          component={Link}
          to="/"
          justify="space-between"
          leftSection={<IconArrowLeft size={18} />}
          rightSection={<span />}
        >
          Back
        </Button>
      }
      headerRightSection={
        <Button
          radius="md"
          variant="default"
          justify="space-between"
          onClick={() => setShowAllEvents(!showAllEvents)}
        >
          {showAllEvents ? "Show fewer" : "Show all"}
        </Button>
      }
    >
      <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md" w="100%">
        {events
          .filter((event) => (showAllEvents ? true : event.image))
          .map(({ image, ...event }, i) => {
            return (
              <Card
                p="md"
                radius="md"
                key={event.slug}
                className={classes.card}
                component={Link}
                to={`/events/${event.slug}`}
              >
                {image && (
                  <AspectRatio ratio={1920 / 1080}>
                    <Image
                      radius={"md"}
                      // The first row is above the fold
                      loading={i < 3 ? "eager" : "lazy"}
                      fetchPriority={i === 0 ? "high" : undefined}
                      src={image.src}
                      srcSet={image.srcSet}
                      sizes="(min-width: 75em) 400px, (min-width: 62em) 30vw, (min-width: 48em) 45vw, 90vw"
                      width={image.width}
                      height={image.height}
                      h="auto"
                      alt=""
                    />
                  </AspectRatio>
                )}
                <Text c="dimmed" size="xs" tt="uppercase" fw={700} mt="md">
                  {event.date}
                </Text>
                <Text size="xl" fw={600} mt={5} component="h2">
                  {event.name}
                </Text>
              </Card>
            );
          })}
      </SimpleGrid>
    </HeaderFooterNav>
  );
}
