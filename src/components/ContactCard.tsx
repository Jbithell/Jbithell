import { Button, Container, Paper, Stack, Text, Title } from "@mantine/core";
import { IconBrandLinkedin, IconBrandMessenger, IconMail } from "@tabler/icons-react";
import { Mantine } from "./Mantine";

export function ContactCard({
  email,
  links,
}: {
  email: string;
  links: { messenger: string; linkedin: string };
}) {
  const contacts = [
    { href: `mailto:${email}`, label: email, description: "Email", icon: IconMail },
    {
      href: links.messenger,
      label: "Facebook Messenger",
      description: "Message",
      icon: IconBrandMessenger,
    },
    { href: links.linkedin, label: "LinkedIn", description: "Connect", icon: IconBrandLinkedin },
  ];
  return (
    <Mantine>
      <Container size="lg" py="xl">
        <Paper withBorder shadow="sm" p="xl" maw={480} mx="auto">
          <Title order={1} ta="center">
            Contact
          </Title>
          <Text c="dimmed" ta="center" mt={4}>
            The quickest way to reach me is by email.
          </Text>
          <Stack gap="xs" mt="lg">
            {contacts.map(({ href, label, description, icon: Icon }, i) => (
              <Button
                key={href}
                component="a"
                href={href}
                rel={href.startsWith("http") ? "me" : undefined}
                size="lg"
                variant={i === 0 ? "filled" : "default"}
                justify="space-between"
                rightSection={<Icon size={22} aria-hidden="true" />}
                aria-label={`${description}: ${label}`}
              >
                {label}
              </Button>
            ))}
          </Stack>
        </Paper>
      </Container>
    </Mantine>
  );
}
