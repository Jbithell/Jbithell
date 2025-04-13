import {
  AppShell,
  BackgroundImage,
  Center,
  Container,
  ScrollArea,
} from "@mantine/core";
import { useViewportSize } from "@mantine/hooks";
import React from "react";
import { Footer } from "./Footer";
import { Header } from "./Header";

const ScrollAreaElement = ({
  children,
  scrollAreaHeight,
}: {
  children: React.ReactNode;
  scrollAreaHeight: number;
}) => {
  return (
    <ScrollArea h={scrollAreaHeight + 32} type="auto" offsetScrollbars>
      <Container size="xl" p={"md"}>
        <Center
          style={{
            minHeight: scrollAreaHeight - 32,
          }}
        >
          {children}
        </Center>
      </Container>{" "}
    </ScrollArea>
  );
};

export function HeaderFooterNav({
  children,
  footer,
  background,
  headerTitle,
  headerLeftSection,
  headerRightSection,
}: {
  children: React.ReactNode;
  footer: boolean;
  background?: boolean;
  headerTitle?: string;
  headerLeftSection?: React.ReactNode;
  headerRightSection?: React.ReactNode;
}) {
  const { height } = useViewportSize();
  const showHeader = headerTitle || headerLeftSection || headerRightSection;
  const showFooter = footer;
  const scrollAreaHeight =
    height - ((showHeader ? 60 : 0) + (showFooter ? 60 : 0) + 32); // 32 accounts for some padding
  return (
    <AppShell
      header={{ height: showHeader ? 60 : 0 }}
      footer={{ height: showFooter ? 60 : 0 }}
      padding={0}
    >
      {headerTitle || headerLeftSection || headerRightSection ? (
        <AppShell.Header>
          <Header
            title={headerTitle ?? ""}
            leftSection={headerLeftSection}
            rightSection={headerRightSection}
          />
        </AppShell.Header>
      ) : null}
      <AppShell.Main style={{ background: "whitesmoke" }}>
        {background !== false ? (
          <BackgroundImage
            src={"/images/backgrounds/wales3-comp.jpg"}
            radius={0}
          >
            <ScrollAreaElement scrollAreaHeight={scrollAreaHeight}>
              {children}
            </ScrollAreaElement>
          </BackgroundImage>
        ) : (
          <ScrollAreaElement scrollAreaHeight={scrollAreaHeight}>
            {children}
          </ScrollAreaElement>
        )}
      </AppShell.Main>
      {footer ? (
        <AppShell.Footer>
          <Footer />
        </AppShell.Footer>
      ) : null}
    </AppShell>
  );
}
