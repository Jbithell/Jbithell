import { AppShell, Center, Container } from "@mantine/core";
import React from "react";
import { getImage } from "../../images";
import classes from "./HeaderFooterNav.module.css";
import { Footer } from "./Footer";
import { Header } from "./Header";

const backgroundImage = getImage("backgrounds/wales3.jpg");

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
  const showHeader = headerTitle || headerLeftSection || headerRightSection;
  return (
    <AppShell
      header={showHeader ? { height: 60 } : undefined}
      footer={footer ? { height: 60 } : undefined}
      padding={0}
    >
      {showHeader ? (
        <AppShell.Header>
          <Header
            title={headerTitle ?? ""}
            leftSection={headerLeftSection}
            rightSection={headerRightSection}
          />
        </AppShell.Header>
      ) : null}
      <AppShell.Main className={classes.main}>
        {background !== false ? (
          <img
            className={classes.background}
            src={backgroundImage.src}
            srcSet={backgroundImage.srcSet}
            sizes="100vw"
            width={backgroundImage.width}
            height={backgroundImage.height}
            alt=""
          />
        ) : null}
        <Container size="xl" p="md" className={classes.content}>
          <Center className={classes.centre}>{children}</Center>
        </Container>
      </AppShell.Main>
      {footer ? (
        <AppShell.Footer>
          <Footer />
        </AppShell.Footer>
      ) : null}
    </AppShell>
  );
}
