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
import { Link, type HeadFC, type PageProps } from "gatsby";
import * as React from "react";
import { EventPortolioObject } from "../../types";
import Layout from "../navigation/Layout";
import { SEO } from "../SEO";
import * as classes from "./EventsPage.module.css";
const Page: React.FC<PageProps> = ({ pageContext }) => {
  const { events } = pageContext as { events: EventPortolioObject[] };
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
    <Layout
      footer={true}
      background={false}
      headerTitle="Event Portfolio"
      headerLeftSection={
        <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
          <Button
            radius="md"
            variant="default"
            justify="space-between"
            leftSection={<IconArrowLeft size={18} />}
            rightSection={<span />}
          >
            Back
          </Button>
        </Link>
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
            <Link
              to={`/events/${event.slug}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Card
                p="md"
                radius="md"
                className={classes.card}
                style={{ width: cardSize }}
              >
                {event.featuredImage && (
                  <AspectRatio
                    ratio={1920 / 1080}
                    style={{ width: cardSize - 32 }}
                  >
                    <Image
                      radius={"md"}
                      loading="lazy"
                      src={
                        "/images/compressed/portfolio/" + event.featuredImage
                      }
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
            </Link>
          ))}
      </Flex>
    </Layout>
  );
};

export default Page;

export const Head: HeadFC = ({ pageContext }) => {
  return <SEO title="Live Events Portfolio" />;
};
