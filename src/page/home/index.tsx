import { Footer } from "../../components/Footer/Footer";
import { FeaturesSection } from "../../components/Landing/FeaturesSection";
import { Header } from "../../components/Landing/Header";
import { HeroSection } from "../../components/Landing/HeroSection";
import { LandingContainer } from "../../components/Landing/LandingContainer";

export default function Home() {
	return (
		<LandingContainer>
			<Header
				links={[
					{
						link: "/about",
						label: "Home",
					},
					{
						link: "/ecosystem",
						label: "Ecosystem",
					},
					{
						link: "/rescource",
						label: "Developer Resource",
					},
				]}
			/>
			<HeroSection />
			<FeaturesSection title="Features" />
			<Footer />
		</LandingContainer>
	);
}
