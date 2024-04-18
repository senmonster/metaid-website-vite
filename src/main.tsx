import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "@mantine/core/styles.css"; // mantine css style
import "./global.css"; // tailwind css style
import "./react-toastify.css";

import { RecoilRoot } from "recoil";
import { AppProvider } from "./provider";

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<RecoilRoot>
			<AppProvider>
				<App />
			</AppProvider>
		</RecoilRoot>
	</React.StrictMode>
);
