import { Badge, Button, Group } from "@mantine/core";
import { Mantine } from "./Mantine";

export interface FilterLink {
  href: string;
  label: string;
  count?: number;
  current: boolean;
}

/** Links that filter the portfolio, e.g. by discipline */
export function FilterNav({ label, links }: { label: string; links: FilterLink[] }) {
  return (
    <Mantine>
      <Group component="nav" aria-label={label} gap="xs" mt="lg">
        {links.map((link) => (
          <Button
            key={link.href}
            component="a"
            href={link.href}
            size="compact-md"
            radius="xl"
            variant={link.current ? "filled" : "default"}
            aria-current={link.current ? "page" : undefined}
            rightSection={
              link.count !== undefined ? (
                <Badge
                  size="sm"
                  variant={link.current ? "white" : "light"}
                  circle={link.count < 10}
                >
                  {link.count}
                </Badge>
              ) : undefined
            }
          >
            {link.label}
          </Button>
        ))}
      </Group>
    </Mantine>
  );
}
