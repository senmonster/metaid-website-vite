import { useParams } from 'react-router-dom';
import { PageContainer } from '../../components/PageContainer/PageContainer';
import MetaidDetail from '@/components/MetaidDetail';

export default function DashboardMetaidDetail() {
  const { id } = useParams();

  return (
    <PageContainer title='MetaID UserInfo' withBackup>
      <MetaidDetail id={id!} />
    </PageContainer>
  );
}
