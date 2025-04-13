import {
  AspectRatio,
  Button,
  Card,
  Flex,
  Image,
  Text,
  useMatches,
} from "@mantine/core";
import { useViewportSize } from "@mantine/hooks";
import { IconArrowLeft } from "@tabler/icons-react";
import * as React from "react";
import { Link } from "react-router";
import eventPortfolio from "../../eventPortfolio.json";
import * as classes from "../components/EventsPage.module.css";
import { HeaderFooterNav } from "../components/navigation/HeaderFooterNav";
import { EventPortfolioObject } from "../types.d";
import type { Route } from "./+types/events";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Live Events Portfolio" },
    { name: "description", content: "James Bithell's live events Portfolio" },
  ];
}

export async function loader({}: Route.LoaderArgs) {
  const events = eventPortfolio as EventPortfolioObject[];
  return { events };
}

export default function Page({ loaderData }: Route.ComponentProps) {
  const { events } = loaderData;
  const { width } = useViewportSize();
  const [showAllEvents, setShowAllEvents] = React.useState(false);
  const cardSize = useMatches({
    base: width * 0.8,
    sm: width * 0.4,
    md: width * 0.3,
    lg: width * 0.3,
    xl: width * 0.3,
  });
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
      <Flex gap="md" justify="center" direction="row" wrap="wrap">
        {events
          .slice()
          .reverse()
          .filter((event) => (showAllEvents ? true : event.featuredImage))
          .map((event) => (
            <Card
              p="md"
              radius="md"
              key={event.slug}
              className={classes.card}
              style={{ width: cardSize }}
              component={Link}
              to={`/events/${event.slug}`}
            >
              {event.featuredImage && (
                <AspectRatio
                  ratio={1920 / 1080}
                  style={{ width: cardSize - 32 }}
                >
                  <Image
                    radius={"md"}
                    loading="lazy"
                    src={"/images/portfolio/" + event.featuredImage}
                  />
                </AspectRatio>
              )}
              <Text c="dimmed" size="xs" tt="uppercase" fw={700} mt="md">
                {event.date}
              </Text>
              <Text size="xl" fw={600} mt={5}>
                {event.name}
              </Text>
            </Card>
          ))}
      </Flex>
    </HeaderFooterNav>
  );
}
