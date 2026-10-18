import { Anchor, Avatar, Badge, Box, Group, Paper, Text, Title, Typography } from "@mantine/core";
import { IconBriefcase, IconHeartHandshake, IconLock, IconSchool } from "@tabler/icons-react";
import type { ReactNode } from "react";
import type { ResponsiveImage } from "../lib/images";
import { Mantine } from "./Mantine";
import classes from "./CvItem.module.css";

export interface CvItemData {
  id: string;
  /** Job title, or qualification for education */
  title: string;
  organisation: string;
  organisationUrl?: string;
  logo: ResponsiveImage | null;
  /** e.g. employment type and location */
  meta: string[];
  dates: string;
  /** Marked with a badge on the private CV, so it's clear what the public can't see */
  private: boolean;
  /** Education results; the grade is omitted when it isn't shown to this audience */
  results?: { subject: string; grade?: string }[];
  projects: { title: string; href: string }[];
  kind: "work" | "volunteering" | "education";
  /** Whether the description and private details slots have content */
  hasDescription: boolean;
  hasPrivateDetails: boolean;
}

const icons = { work: IconBriefcase, volunteering: IconHeartHandshake, education: IconSchool };

/**
 * One CV entry. The description is passed as children, and private details through the
 * privateDetails slot, since both are rich text rendered by Astro
 */
export function CvItem({
  item,
  children,
  privateDetails,
}: {
  item: CvItemData;
  children?: ReactNode;
  privateDetails?: ReactNode;
}) {
  const Icon = icons[item.kind];
  return (
    <Mantine>
      <Group component="article" align="flex-start" wrap="nowrap" gap="md" className={classes.item}>
        <Avatar
          src={item.logo?.src}
          imageProps={
            item.logo
              ? { srcSet: item.logo.srcSet, sizes: item.logo.sizes, width: 56, height: 56 }
              : undefined
          }
          size={56}
          radius="md"
          alt=""
          className={classes.logo}
        >
          <Icon size={28} stroke={1.5} aria-hidden="true" />
        </Avatar>
        <Box className={classes.body}>
          <Group justify="space-between" align="baseline" gap="xs" wrap="wrap">
            <Title order={3} fz="h4">
              {item.title}
            </Title>
            <Text size="sm" c="dimmed">
              {item.dates}
            </Text>
          </Group>
          <Text fw={500}>
            {item.organisationUrl ? (
              <Anchor href={item.organisationUrl} inherit rel="noopener">
                {item.organisation}
              </Anchor>
            ) : (
              item.organisation
            )}
          </Text>
          {(item.meta.length > 0 || item.private) && (
            <Group gap="xs" mt={2}>
              {item.meta.length > 0 && (
                <Text size="sm" c="dimmed">
                  {item.meta.join(" · ")}
                </Text>
              )}
              {item.private && (
                <Badge
                  variant="light"
                  color="gray"
                  leftSection={<IconLock size={12} aria-hidden="true" />}
                >
                  Private
                </Badge>
              )}
            </Group>
          )}
          {item.results && item.results.length > 0 && (
            <Text size="sm" mt="xs">
              {item.results.map((result, i) => (
                <span key={result.subject}>
                  {i > 0 && " · "}
                  {result.subject}
                  {result.grade && <strong>: {result.grade}</strong>}
                </span>
              ))}
            </Text>
          )}
          {item.hasDescription && (
            <Typography mt="xs" className={classes.description}>
              {children}
            </Typography>
          )}
          {item.hasPrivateDetails && (
            <Paper withBorder p="sm" mt="sm" radius="md" className={classes.private}>
              <Text size="xs" tt="uppercase" fw={700} c="dimmed">
                Private details
              </Text>
              <Typography className={classes.description}>{privateDetails}</Typography>
            </Paper>
          )}
          {item.projects.length > 0 && (
            <Text size="sm" mt="xs">
              <Text span c="dimmed" inherit>
                Projects:{" "}
              </Text>
              {item.projects.map((project, i) => (
                <span key={project.href}>
                  {i > 0 && ", "}
                  <Anchor href={project.href} inherit>
                    {project.title}
                  </Anchor>
                </span>
              ))}
            </Text>
          )}
        </Box>
      </Group>
    </Mantine>
  );
}
