import { Button, Container, ContainerProps, Space, Title } from '@mantine/core';
import { IconTruckReturn } from '@tabler/icons-react';
import { FC, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

type PageContainerProps = {
  children: ReactNode;
  title: string;
  withBackup?: boolean;
} & Pick<ContainerProps, 'fluid'>;

export const PageContainer: FC<PageContainerProps> = ({
  children,
  title,
  withBackup = false,

  fluid = true,
}) => {
  const navigate = useNavigate();
  return (
    <Container px={0} fluid={fluid}>
      <div className='flex justify-between items-center'>
        <Title order={4}>{title}</Title>
        {withBackup && (
          <Button
            leftSection={<IconTruckReturn size={22} />}
            size='sm'
            variant='outline'
            style={{
              border: 'none',
              borderRadius: '8px',
              boxShadow:
                '0px 1px 1px 0px rgba(103, 62, 19, 0.5),0px 0px 0px 1px #673E13',
            }}
            onClick={() => navigate(-1)}
          >
            Return
          </Button>
        )}
      </div>

      <Space h='lg' />

      {children}
    </Container>
  );
};
