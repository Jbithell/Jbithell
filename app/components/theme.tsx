import {
  createTheme,
  type CSSVariablesResolver,
  type MantineColorsTuple,
  MantineProvider,
} from "@mantine/core";
/**
 * Doing this in a separate file allows us to use the theme in renderToStaticMarkup(
 */

const myColor: MantineColorsTuple = [
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

const theme = createTheme({
  primaryColor: "pink",
  colors: {
    pink: myColor,
  },
  primaryShade: 3,
});

// The default dimmed colour (gray.6) doesn't have enough contrast against white
const cssVariablesResolver: CSSVariablesResolver = (theme) => ({
  variables: {},
  light: { "--mantine-color-dimmed": theme.colors.gray[7] },
  dark: {},
});

export const MantineProviderWrapper = (props: {
  children: React.ReactNode;
}) => (
  <MantineProvider
    theme={theme}
    defaultColorScheme="auto"
    cssVariablesResolver={cssVariablesResolver}
  >
    {props.children}
  </MantineProvider>
);
