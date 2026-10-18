import { MantineProvider } from "@mantine/core";
import type { ReactNode } from "react";
import { cssVariablesResolver, theme } from "./theme";

/**
 * Pages are rendered to static HTML by Astro without hydration, so each React component tree
 * rendered from an .astro file needs its own provider. The theme's CSS variables and global
 * classes are output once per page by <MantineStyles /> instead of by every tree.
 */
export function Mantine({ children }: { children: ReactNode }) {
  return (
    <MantineProvider
      theme={theme}
      defaultColorScheme="auto"
      cssVariablesResolver={cssVariablesResolver}
      withCssVariables={false}
      withGlobalClasses={false}
    >
      {children}
    </MantineProvider>
  );
}

export function MantineStyles() {
  return (
    <MantineProvider
      theme={theme}
      defaultColorScheme="auto"
      cssVariablesResolver={cssVariablesResolver}
    >
      {null}
    </MantineProvider>
  );
}
