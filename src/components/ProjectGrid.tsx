import { Container, SimpleGrid, Text } from "@mantine/core";
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
