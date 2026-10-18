import { createTheme, type CSSVariablesResolver, type MantineColorsTuple } from "@mantine/core";

const brand: MantineColorsTuple = [
  "#ffe9e9",
  "#ffd0d0",
  "#fd9d9d",
  "#fc6766",
  "#fc3b38",
  "#fc231c",
  "#fd160e",
  "#e20a03",
  "#c90000",
  "#b00000",
];

export const theme = createTheme({
  primaryColor: "brand",
  colors: { brand },
  // Darker shades in light mode so text and filled buttons pass WCAG AA contrast
  primaryShade: { light: 8, dark: 4 },
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
