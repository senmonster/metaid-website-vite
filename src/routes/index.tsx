/* eslint-disable react-refresh/only-export-components */
import { Navigate, RouteObject } from "react-router-dom";
import { lazy } from "react";

const Home = lazy(() => import("../page/home"));
const DashboardLayout = lazy(() => import("../page/dashboard"));
const DashboardMetaID = lazy(() => import("../page/metaid"));
const DashboardPin = lazy(() => import("../page/pin"));
const DashboardMyPin = lazy(() => import("../page/my-pin"));
const DashboardBlock = lazy(() => import("../page/block"));
const DashboardMempool = lazy(() => import("../page/mempool"));
const DashboardMetaprotocol = lazy(() => import("../page/metaprotocol"));
const DashboardPinDetail = lazy(() => import("../page/pin-detail"));

export const routes: RouteObject[] = [
	{
		path: "/",
		element: <Home />,
	},
	{
		path: "dashboard",
		element: <DashboardLayout />,
		children: [
			{ index: true, element: <Navigate to="metaid" /> },
			{
				path: "metaid",
				element: <DashboardMetaID />,
			},
			{
				path: "pin",
				element: <DashboardPin />,
			},
			{
				path: "my-pin",
				element: <DashboardMyPin />,
			},
			{
				path: "block",
				element: <DashboardBlock />,
			},
			{
				path: "mempool",
				element: <DashboardMempool />,
			},
			{
				path: "metaprotocol",
				element: <DashboardMetaprotocol />,
			},
			{
				path: "pin-detail/:id",
				element: <DashboardPinDetail />,
			},
		],
	},
];
