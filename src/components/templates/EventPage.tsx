import { Button, Card, Group, Image, Text, useMatches } from "@mantine/core";
import { useViewportSize } from "@mantine/hooks";
import {
  IconArrowLeft,
  IconBuildingBank,
  IconMapPin,
  IconUserCircle,
} from "@tabler/icons-react";
import { navigate, type HeadFC, type PageProps } from "gatsby";
import * as React from "react";
import { SEO } from "../../components/SEO";
import { EventPortolioObject } from "../../types";
import Layout from "../navigation/Layout";
const Page: React.FC<PageProps> = ({ pageContext }) => {
  const { event } = pageContext as { event: EventPortolioObject };
  const { width } = useViewportSize();
  const imageWidth = useMatches({
    base: "100%",
    sm: width * 0.6,
    md: width * 0.5,
    lg: width * 0.5,
    xl: width * 0.5,
  });
  return (
    <Layout
      footer={true}
      background={false}
      headerTitle={event.name}
      headerLeftSection={
        <Button
          visibleFrom="sm"
          radius="md"
          variant="default"
          onClick={() => navigate(-1)}
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
                src={"/images/compressed/portfolio/" + event.featuredImage}
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
    </Layout>
  );
};

export default Page;

export const Head: HeadFC = ({ pageContext }) => {
  const { event } = pageContext as { event: EventPortolioObject };
  return <SEO title={`${event.name} | Live Events Portfolio`} />;
};
