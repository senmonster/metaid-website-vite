import {
  ColorSchemeScript,
  MantineProvider,
  colorsTuple,
  //   NumberInput,
  createTheme,
} from '@mantine/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
    },
  },
});

const theme = createTheme({
  primaryColor: 'deeporange',
  colors: {
    deeporange: colorsTuple('#E9983D'),
  },
});

export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ColorSchemeScript defaultColorScheme='dark' />
        <MantineProvider defaultColorScheme='dark' theme={theme}>
          {children}
        </MantineProvider>
        <ReactQueryDevtools initialIsOpen={true} />
      </QueryClientProvider>
    </>
  );
}
