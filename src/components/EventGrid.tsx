import { Button, Container, Group, SimpleGrid, Stack, Title } from "@mantine/core";
import { IconArrowRight } from "@tabler/icons-react";
import { EventCard, type EventCardData } from "./EventCard";
import { Mantine } from "./Mantine";
import classes from "./EventGrid.module.css";

/** Events grouped into a section per year */
export function EventGrid({ groups }: { groups: { year: string; events: EventCardData[] }[] }) {
  let index = 0;
  return (
    <Mantine>
      <Container size="lg">
        <Stack gap="xl">
          {groups.map((group) => (
            <section
              key={group.year}
              aria-labelledby={`year-${group.year}`}
              className={classes.year}
            >
              <Title order={2} id={`year-${group.year}`} mb="md">
                {group.year}
              </Title>
              <SimpleGrid cols={{ base: 1, xs: 2, md: 3 }} spacing="lg">
                {group.events.map((event) => (
                  <EventCard key={event.href} event={event} priority={index++ < 3} />
                ))}
              </SimpleGrid>
            </section>
          ))}
        </Stack>
      </Container>
    </Mantine>
  );
}

export function RecentWork({
  events,
  more,
}: {
  events: EventCardData[];
  more: { href: string; label: string };
}) {
  return (
    <Mantine>
      <Container size="lg" component="section" py="xl" aria-labelledby="recent-work">
        <Group justify="space-between" align="center" mb="lg">
          <Title order={2} id="recent-work">
            Event portfolio
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
          {events.map((event) => (
            <EventCard key={event.href} event={event} />
          ))}
        </SimpleGrid>
      </Container>
    </Mantine>
  );
}
