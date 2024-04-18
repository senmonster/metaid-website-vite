import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: Infinity,
		},
	},
});

export function AppProvider({ children }: { children: React.ReactNode }) {
	return (
		<>
			<QueryClientProvider client={queryClient}>
				<ColorSchemeScript defaultColorScheme="dark" />
				<MantineProvider defaultColorScheme="dark">{children}</MantineProvider>
				<ReactQueryDevtools initialIsOpen={true} />
			</QueryClientProvider>
		</>
	);
}
