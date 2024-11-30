import { AspectRatio, Card, Image, SimpleGrid, Text } from "@mantine/core";
import { Link, type HeadFC, type PageProps } from "gatsby";
import * as React from "react";
import { SEO } from "../SEO";
import { EventPortolioObject } from "../../types";
import * as classes from "./EventsPage.module.css";
import Layout from "../navigation/Layout";
const Page: React.FC<PageProps> = ({ pageContext }) => {
  const { events } = pageContext as { events: EventPortolioObject[] };

  return (
    <Layout footer={true}>
      <SimpleGrid cols={{ base: 1, sm: 2 }}>
        {events.map((event) => (
          <Link
            to={`/events/${event.slug}`}
            key={event.slug}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <Card
              p="md"
              radius="md"
              component="a"
              href="#"
              className={classes.card}
            >
              {event.featuredImage && (
                <AspectRatio ratio={1920 / 1080}>
                  <Image
                    src={"/images/compressed/portfolio/" + event.featuredImage}
                  />
                </AspectRatio>
              )}
              <Text c="dimmed" size="xs" tt="uppercase" fw={700} mt="md">
                {event.date}
              </Text>
              <Text className={classes.title} mt={5}>
                {event.name}
              </Text>
            </Card>
          </Link>
        ))}
      </SimpleGrid>
    </Layout>
  );
};

export default Page;

export const Head: HeadFC = ({ pageContext }) => {
  return <SEO title="Live Events Portfolio" />;
};
