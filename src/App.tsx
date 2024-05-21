import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { routes } from "./routes";
// import DashboardLayout from "./page/dashboard";
// import DashboardMetaID from "./page/metaid";
// import DashboardPin from "./page/pin";
// import DashboardMyPin from "./page/my-pin";
// import DashboardBlock from "./page/block";
// import DashboardMempool from "./page/mempool";
// <BrowserRouter>
// 	<Routes>
// 		<Route path="/" element={<DashboardLayout />}>
// 			<Route path="metaid" element={<DashboardMetaID />} index />
// 			<Route path="pin" element={<DashboardPin />} />
// 			<Route path="my-pin" element={<DashboardMyPin />} />
// 			<Route path="block" element={<DashboardBlock />} />
// 			<Route path="mempool" element={<DashboardMempool />} />
// 		</Route>
// 	</Routes>
// </BrowserRouter>
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
