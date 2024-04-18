import { Image, useMantineColorScheme } from "@mantine/core";

import classes from "./Logo.module.css";
import { Link } from "react-router-dom";
interface Props {
	width?: string;
	height?: string;
}

export const Logo: React.FC<Props> = () => {
	const { colorScheme } = useMantineColorScheme();

	return (
		<div>
			<Link to="/" style={{ textDecoration: "none" }} className={classes.heading}>
				<Image
					src={colorScheme === "dark" ? "/logo_metaid_bai.png" : "/logo_metaid.png"}
					alt="image"
					h={20}
					w="auto"
					fit="contain"
				/>
			</Link>
		</div>
	);
};
