import { useParams } from "react-router-dom";
import { PageContainer } from "../../components/PageContainer/PageContainer";
import PinDetail from "../../components/PinDetail";

export default function DashboardPinDetail() {
	const { id } = useParams();

	return (
		<PageContainer title="PinDetail">
			<PinDetail id={id!} />
		</PageContainer>
	);
}
