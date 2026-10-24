import {
  Badge,
  Button,
  Container,
  Grid,
  Group,
  Image,
  Paper,
  Stack,
  Text,
  Title,
  Typography,
} from "@mantine/core";
import { IconBrandGithub, IconExternalLink } from "@tabler/icons-react";
import type { ReactNode } from "react";
import type { ResponsiveImage } from "../lib/images";
import { Mantine } from "./Mantine";
import { BreadcrumbNav, type Crumb } from "./PageHeader";

export interface ProjectDetailData {
  title: string;
  summary?: string;
  year?: string;
  badges: string[];
  image: ResponsiveImage | null;
  repoUrl?: string;
  homepageUrl?: string;
}

export function ProjectDetail({
  project,
  breadcrumbs,
  children,
}: {
  project: ProjectDetailData;
  breadcrumbs: Crumb[];
  children?: ReactNode;
}) {
  const details = (
    <Stack gap="lg">
      <div>
        <Title order={1}>{project.title}</Title>
        {project.year && (
          <Text size="lg" c="dimmed" mt={4}>
            Since {project.year}
          </Text>
        )}
        {project.badges.length > 0 && (
          <Group gap="xs" mt="sm">
            {project.badges.map((badge) => (
              <Badge
                key={badge}
                variant="light"
                size="lg"
                color={badge === "Archived" ? "gray" : undefined}
              >
                {badge}
              </Badge>
            ))}
          </Group>
        )}
      </div>
      {project.summary && <Text size="lg">{project.summary}</Text>}
      {(project.repoUrl || project.homepageUrl) && (
        <Group gap="sm">
          {project.homepageUrl && (
            <Button
              component="a"
              href={project.homepageUrl}
              rel="noopener"
              leftSection={<IconExternalLink size={18} aria-hidden="true" />}
            >
              Website
            </Button>
          )}
          {project.repoUrl && (
            <Button
              component="a"
              href={project.repoUrl}
              rel="noopener"
              variant={project.homepageUrl ? "default" : "filled"}
              leftSection={<IconBrandGithub size={18} aria-hidden="true" />}
            >
              Source code
            </Button>
          )}
        </Group>
      )}
      {children && <Typography>{children}</Typography>}
    </Stack>
  );

  return (
    <Mantine>
      <Container size="lg" pt="xl" pb="lg">
        <BreadcrumbNav breadcrumbs={breadcrumbs} />
        {project.image ? (
          <Grid gap="xl">
            <Grid.Col span={{ base: 12, md: 7 }}>
              <Paper withBorder radius="md" style={{ overflow: "hidden" }}>
                <Image
                  src={project.image.src}
                  srcSet={project.image.srcSet}
                  sizes={project.image.sizes}
                  width={project.image.width}
                  height={project.image.height}
                  alt={project.image.alt}
                  fetchPriority="high"
                  decoding="async"
                  h="auto"
                />
              </Paper>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 5 }}>{details}</Grid.Col>
          </Grid>
        ) : (
          <div style={{ maxWidth: 720 }}>{details}</div>
        )}
      </Container>
    </Mantine>
  );
}
