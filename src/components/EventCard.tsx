import { Card, Image, Text, Title } from "@mantine/core";
import { IconMasksTheater } from "@tabler/icons-react";
import type { ResponsiveImage } from "../lib/images";
import classes from "./EventCard.module.css";

export interface EventCardData {
  href: string;
  title: string;
  dateLabel: string;
  dateTime: string;
  year: string;
  roles: string[];
  venue?: string;
  image: ResponsiveImage | null;
}

export function EventCard({
  event,
  headingOrder = 3,
  priority = false,
}: {
  event: EventCardData;
  headingOrder?: 2 | 3;
  priority?: boolean;
}) {
  const { image } = event;
  return (
    <Card component="a" href={event.href} withBorder padding="md" className={classes.card}>
      <Card.Section className={classes.media}>
        {image ? (
          <Image
            src={image.src}
            srcSet={image.srcSet}
            sizes={image.sizes}
            width={image.width}
            height={image.height}
            alt=""
            loading={priority ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : undefined}
            decoding="async"
            className={classes.image}
            style={image.style}
          />
        ) : (
          <div className={classes.placeholder}>
            <IconMasksTheater size={48} stroke={1.25} aria-hidden="true" />
          </div>
        )}
      </Card.Section>
      <Text
        component="time"
        dateTime={event.dateTime}
        size="xs"
        tt="uppercase"
        fw={700}
        c="dimmed"
        mt="md"
      >
        {event.dateLabel}
      </Text>
      <Title order={headingOrder} fz="h4" mt={4} className={classes.title}>
        {event.title}
      </Title>
      {event.roles.length > 0 && (
        <Text size="sm" c="dimmed" mt={4} lineClamp={2}>
          {event.roles.join(" · ")}
        </Text>
      )}
    </Card>
  );
}
