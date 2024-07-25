import { metaidService } from '@/utils/api';
import { queryOptions } from '@tanstack/react-query';

export const metaidInfoQueryOptions = ({ metaid }: { metaid: string }) => {
  return queryOptions({
    queryKey: ['metaidIfno', metaid ?? ''],
    queryFn: () => metaidService.getMetaidInfo({ metaId: metaid ?? '' }),
  });
};
