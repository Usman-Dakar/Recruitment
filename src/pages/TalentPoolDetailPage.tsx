import { useParams, Navigate } from 'react-router-dom';
import { PageWrapper } from '@/components/layout';
import { TalentPoolDetail } from '@/features/talent-pools';

export default function TalentPoolDetailPage() {
  const { id } = useParams<{ id: string }>();
  if (!id) return <Navigate to="/talent-pools" replace />;

  return (
    <PageWrapper>
      <TalentPoolDetail poolId={id} />
    </PageWrapper>
  );
}
