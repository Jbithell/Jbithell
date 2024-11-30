// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import '@mantine/core/styles.css';

import { MantineProvider } from '@mantine/core';
import { theme } from './src/theme';
import React from 'react';

export const wrapPageElement = ({ element }: { element: React.ReactNode }) => {
  return <MantineProvider theme={theme}>{element}</MantineProvider>;
};