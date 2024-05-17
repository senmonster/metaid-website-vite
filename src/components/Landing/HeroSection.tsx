import { Button, Container, Group, Text, Title, Image, useMantineColorScheme } from "@mantine/core";
import { IconArrowRight, IconStar } from "@tabler/icons-react";

import classes from "./HeroSection.module.css";
import cls from "classnames";
import { useNavigate } from "react-router-dom";
export function HeroSection() {
	const navigate = useNavigate();
	const { colorScheme } = useMantineColorScheme();

	return (
		<Container pt="sm" size="lg">
			<div className={classes.inner}>
				<Image
					src={colorScheme === "dark" ? "/logo_metaid_bai.png" : "/logo_metaid.png"}
					alt="image"
					w={400}
					h="auto"
				/>
				<Title className={cls(classes.subtitle, { "text-white": colorScheme === "dark" })}>
					Cross-Chain DID Protocol Born for Web3
				</Title>

				<div className={cls(classes.description, "mt-7")}>
					<Text>MetaID brings us into the web3 new era</Text>
					<Text>
						where 7 billion users can truly own their data and data between apps can be
						interoperable.
					</Text>
				</div>

				<Group mt={40}>
					<Button
						size="lg"
						className={classes.control}
						onClick={() => {
							navigate("/dashboard");
						}}
						rightSection={<IconArrowRight />}
					>
						Try It Now
					</Button>
					<Button
						variant="outline"
						size="lg"
						className={classes.control}
						onClick={() => {
							// open github
							window.open("https://github.com/orgs/MetaID-Labs/repositories");
						}}
						rightSection={<IconStar />}
					>
						Give a Star
					</Button>
				</Group>
			</div>
		</Container>
	);
}
