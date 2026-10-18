import { createTheme, type CSSVariablesResolver } from "@mantine/core";

export const theme = createTheme({
  // Neutral accents, so the photos provide the colour
  primaryColor: "gray",
  primaryShade: { light: 8, dark: 3 },
  autoContrast: true,
  defaultRadius: "md",
  cursorType: "pointer",
  headings: { fontWeight: "700", textWrap: "balance" },
});

// The default dimmed colours don't have enough contrast against the card backgrounds
export const cssVariablesResolver: CSSVariablesResolver = (theme) => ({
  variables: {},
  light: { "--mantine-color-dimmed": theme.colors.gray[7] },
  dark: { "--mantine-color-dimmed": theme.colors.dark[1] },
});
