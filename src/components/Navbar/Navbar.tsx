import { NavLink, ScrollArea } from "@mantine/core";

import classes from "./Navbar.module.css";

import cls from "classnames";
import { useLocation } from "react-router-dom";
import { NavItem } from "../../types/nav-item";

interface Props {
	data: NavItem[];
	hidden?: boolean;
}

export function Navbar({ data }: Props) {
	const location = useLocation();
	const pathname = location.pathname;

	const links = data.map((item) => {
		// console.log("connected", connected, "item label", item.label, item.label === "My Pin");

		return (
			// <NavLinksGroup key={item.label} {...item} />
			<NavLink
				className="rounded-md"
				key={item.label}
				href={item.link}
				active={item.link === pathname}
				label={item.label}
				onClick={(e) => {
					if (item.label === "MetaProtocol") {
						e.preventDefault();
						window.open(`https://metaprotocols.vercel.app/`, "_blank");
					}
					if (item.label === "Handbook") {
						e.preventDefault();
						window.open(`https://doc.metaid.io/`, "_blank");
					}
					if (item.label === "Github") {
						e.preventDefault();
						window.open(`https://github.com/metaid-developers`, "_blank");
					}
					if (item.label === "X") {
						e.preventDefault();
						window.open(`https://twitter.com/metaidio`, "_blank");
					}
				}}
				disabled={item.label === "MetaProtocol"}
			/>
		);
	});

	return (
		<>
			<ScrollArea className={classes.links}>
				<div className={cls(classes.linksInner, "flex flex-col gap-2")}>{links}</div>
			</ScrollArea>
		</>
	);
}
