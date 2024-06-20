import {
  AppShell,
  Burger,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Outlet } from 'react-router-dom';
import { navLinks } from '../../config';
import AdminHeader from '../../components/Headers/AdminHeader';
import { ToastContainer } from 'react-toastify';
import { Navbar } from '@/components/Navbar/Navbar';
import './style.css';

export default function DashboardLayout() {
  const [opened, { toggle }] = useDisclosure();
  const { colorScheme } = useMantineColorScheme();
  const theme = useMantineTheme();

  const bg = colorScheme === 'dark' ? '#181615' : theme.colors.gray[0];

  return (
    <>
      <ToastContainer
        position='top-center'
        toastStyle={{
          width: '380px',
        }}
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={colorScheme === 'dark' ? 'dark' : 'light'}
        closeButton={false}
      />
      <div className='!bg-black'>
        <AppShell
          header={{ height: 70 }}
          layout='alt'
          navbar={{
            width: 200,
            breakpoint: 'sm',
            collapsed: { mobile: !opened },
          }}
          padding='md'
          transitionDuration={500}
          transitionTimingFunction='ease'
          // className='absolute left-0 z-10'
        >
          <AppShell.Navbar bg={bg}>
            <Navbar data={navLinks} hidden={!opened} />
          </AppShell.Navbar>
          <AppShell.Header bg={bg}>
            <AdminHeader
              burger={
                <Burger
                  opened={opened}
                  onClick={toggle}
                  hiddenFrom='sm'
                  size='sm'
                  mr='xl'
                />
              }
            />
          </AppShell.Header>
          <AppShell.Main bg={bg}>
            <Outlet />
          </AppShell.Main>
        </AppShell>
      </div>
    </>
  );
}
