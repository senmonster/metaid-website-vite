import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { routes } from "./routes";
import { Suspense } from "react";
import FallbackLoader from "./components/FallbackLoader";

const router = createBrowserRouter(routes);

export default function App() {
	return (
		<Suspense fallback={<FallbackLoader />}>
			<RouterProvider router={router} />
		</Suspense>
	);
}
