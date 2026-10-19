import { Button, Container, Group, SimpleGrid, Text, Title } from "@mantine/core";
import { IconArrowRight } from "@tabler/icons-react";
import { Mantine } from "./Mantine";
import { ProjectCard, type ProjectCardData } from "./ProjectCard";

export function ProjectGrid({ projects }: { projects: ProjectCardData[] }) {
  return (
    <Mantine>
      <Container size="lg">
        {projects.length > 0 ? (
          <SimpleGrid cols={{ base: 1, xs: 2, md: 3 }} spacing="lg">
            {projects.map((project, i) => (
              <ProjectCard key={project.href} project={project} priority={i < 3} />
            ))}
          </SimpleGrid>
        ) : (
          <Text c="dimmed">No projects yet.</Text>
        )}
      </Container>
    </Mantine>
  );
}

export function RecentProjects({
  projects,
  more,
}: {
  projects: ProjectCardData[];
  more: { href: string; label: string };
}) {
  return (
    <Mantine>
      <Container size="lg" component="section" py="xl" aria-labelledby="recent-projects">
        <Group justify="space-between" align="center" mb="lg">
          <Title order={2} id="recent-projects">
            Projects Portfolio
          </Title>
          <Button
            component="a"
            href={more.href}
            variant="light"
            rightSection={<IconArrowRight size={18} aria-hidden="true" />}
          >
            {more.label}
          </Button>
        </Group>
        <SimpleGrid cols={{ base: 1, xs: 2, md: 3 }} spacing="lg">
          {projects.map((project) => (
            <ProjectCard key={project.href} project={project} />
          ))}
        </SimpleGrid>
      </Container>
    </Mantine>
  );
}
