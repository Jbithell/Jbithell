import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import { theme } from './src/theme';
import React from 'react';

export const onPreRenderHTML = ({
  getHeadComponents,
  replaceHeadComponents,
}: {
  getHeadComponents: Function;
  replaceHeadComponents: Function;
}) => {
  const headComponents = getHeadComponents();
  replaceHeadComponents([
    ...headComponents,
    <ColorSchemeScript key="color-scheme-script" />,
  ]);
};

export const wrapPageElement = ({ element }: { element: React.ReactNode }) => {
  return <MantineProvider theme={theme}>{element}</MantineProvider>;
};