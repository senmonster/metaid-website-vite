import { Loader } from "@mantine/core";

export default function FallbackLoader() {
	return (
		<div className="grid w-screen h-screen place-items-center">
			<Loader type="bars" />
		</div>
	);
}
