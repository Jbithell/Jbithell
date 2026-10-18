import { Badge, Card, Group, Image, Text, Title } from "@mantine/core";
import { IconCode } from "@tabler/icons-react";
import type { ResponsiveImage } from "../lib/images";
// Shares the card styling of the Event Portfolio
import classes from "./EventCard.module.css";

export interface ProjectCardData {
  href: string;
  title: string;
  summary?: string;
  year?: string;
  badges: string[];
  image: ResponsiveImage | null;
}

export function ProjectCard({
  project,
  priority = false,
}: {
  project: ProjectCardData;
  priority?: boolean;
}) {
  const { image } = project;
  return (
    <Card component="a" href={project.href} withBorder padding="md" className={classes.card}>
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
            <IconCode size={48} stroke={1.25} aria-hidden="true" />
          </div>
        )}
      </Card.Section>
      {project.year && (
        <Text size="xs" tt="uppercase" fw={700} c="dimmed" mt="md">
          Since {project.year}
        </Text>
      )}
      <Title order={2} fz="h4" mt={project.year ? 4 : "md"} className={classes.title}>
        {project.title}
      </Title>
      {project.summary && (
        <Text size="sm" c="dimmed" mt={4} lineClamp={3}>
          {project.summary}
        </Text>
      )}
      {project.badges.length > 0 && (
        <Group gap={6} mt="sm">
          {project.badges.map((badge) => (
            <Badge key={badge} variant="light" color={badge === "Archived" ? "gray" : undefined}>
              {badge}
            </Badge>
          ))}
        </Group>
      )}
    </Card>
  );
}
