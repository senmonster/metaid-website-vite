import { Container, ContainerProps, Space, Title } from '@mantine/core';
import { FC, ReactNode } from 'react';

type PageContainerProps = {
  children: ReactNode;
  title: string;
} & Pick<ContainerProps, 'fluid'>;

export const PageContainer: FC<PageContainerProps> = ({
  children,
  title,
  fluid = true,
}) => {
  return (
    <Container px={8} fluid={fluid}>
      <Title order={4}>{title}</Title>

      <Space h='lg' />

      {children}
    </Container>
  );
};
