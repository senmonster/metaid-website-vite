import {
  ColorSchemeScript,
  MantineProvider,
  //   NumberInput,
  //   createTheme,
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

// const theme = createTheme({
//   components: {
//     Button: Button.extend({
//       vars: (_, props) => {
//         if (props.size === 'xxl') {
//           return {
//             root: {
//               '--button-height': rem(60),
//               '--button-padding-x': rem(30),
//               '--button-fz': rem(24),
//             },
//           };
//         }

//         if (props.size === 'xxs') {
//           return {
//             root: {
//               '--button-height': rem(24),
//               '--button-padding-x': rem(10),
//               '--button-fz': rem(10),
//             },
//           };
//         }

//         return { root: {} };
//       },
//     }),
//     NumberInput: NumberInput.extend({
//       vars: (_, props) => {
//         if (props.size === 'xxs') {
//           return {
//             wrapper: {
//               '--input-height': '1.875rem',
//               '--input-fz': '0.75rem',
//               '--input-right-section-width': '1.07625rem',
//             },
//             section: {
//               '--input-right-section-size': '0.825rem',
//             },
//           };
//         }

//         return { wrapper: {} };
//       },
//     }),
//   },
// });

export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ColorSchemeScript defaultColorScheme='dark' />
        <MantineProvider defaultColorScheme='dark'>{children}</MantineProvider>
        <ReactQueryDevtools initialIsOpen={true} />
      </QueryClientProvider>
    </>
  );
}
