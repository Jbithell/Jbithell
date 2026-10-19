import { Avatar, Button, Container, Group, Paper, Stack, Text, Title } from "@mantine/core";
import {
  IconBrandGithub,
  IconCode,
  IconFileCv,
  IconMail,
  IconMasksTheater,
} from "@tabler/icons-react";
import type { ResponsiveImage } from "../lib/images";
import { Mantine } from "./Mantine";
import classes from "./HomeHero.module.css";

export function HomeHero({
  name,
  tagline,
  profile,
  background,
  links,
}: {
  name: string;
  tagline?: string;
  profile: ResponsiveImage;
  background: ResponsiveImage;
  links: { linkedin: string; github: string };
}) {
  return (
    <Mantine>
      <section className={classes.hero} aria-labelledby="hero-title">
        <img
          className={classes.background}
          src={background.src}
          srcSet={background.srcSet}
          sizes={background.sizes}
          width={background.width}
          height={background.height}
          alt=""
          fetchPriority="high"
          decoding="async"
        />
        <Container size="lg">
          <Paper withBorder shadow="md" p="xl" maw={420} mx="auto" className={classes.card}>
            <Stack align="center" gap={0}>
              <Avatar
                src={profile.src}
                imageProps={{
                  srcSet: profile.srcSet,
                  sizes: profile.sizes,
                  width: 140,
                  height: 140,
                  fetchPriority: "high",
                }}
                size={140}
                radius={140}
                alt={profile.alt}
              />
              <Title order={1} id="hero-title" mt="md" ta="center">
                {name}
              </Title>
              {tagline && (
                <Text c="dimmed" ta="center">
                  {tagline}
                </Text>
              )}
            </Stack>
            <Stack gap="xs" mt="lg">
              <Button
                component="a"
                href="/projects"
                size="md"
                justify="space-between"
                rightSection={<IconCode size={20} aria-hidden="true" />}
              >
                Projects Portfolio
              </Button>
              <Button
                component="a"
                href="/portfolio"
                size="md"
                justify="space-between"
                rightSection={<IconMasksTheater size={20} aria-hidden="true" />}
              >
                Event Portfolio
              </Button>
              <Button
                component="a"
                href="/contact"
                size="md"
                variant="default"
                justify="space-between"
                rightSection={<IconMail size={20} aria-hidden="true" />}
              >
                Contact
              </Button>
              <Group grow gap="xs">
                <Button
                  component="a"
                  href="/cv"
                  size="md"
                  variant="default"
                  leftSection={<IconFileCv size={20} aria-hidden="true" />}
                >
                  CV
                </Button>
                <Button
                  component="a"
                  href={links.github}
                  rel="me"
                  size="md"
                  variant="default"
                  leftSection={<IconBrandGithub size={20} aria-hidden="true" />}
                >
                  GitHub
                </Button>
              </Group>
            </Stack>
          </Paper>
        </Container>
      </section>
    </Mantine>
  );
}
