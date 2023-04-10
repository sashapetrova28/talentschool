import Head from 'next/head'
import '../styles/globals.scss'
import 'bootstrap/dist/css/bootstrap.min.css';

import useUser from '/lib/useUser.js';
import { Header } from '/components/Header';

import { MantineProvider, Affix, Transition, Button } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import { useWindowScroll } from '@mantine/hooks';
import { ArrowUp } from 'tabler-icons-react';

const MyApp = ({ Component, pageProps }) => {
	const { user } = useUser({
		redirectTo: '/auth',
	});

	const [scroll, scrollTo] = useWindowScroll();

	return <MantineProvider
		withGlobalStyles
		withNormalizeCSS
		theme={{
			colorScheme: 'light',
		}}
	>
		<NotificationsProvider>
			<Head>
				<meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
			</Head>
			<Affix position={{ bottom: 20, right: 20 }}>
				<Transition transition="slide-up" mounted={scroll.y > 0}>
					{(transitionStyles) => (
						<Button
							color="orange"
							leftIcon={<ArrowUp />}
							style={transitionStyles}
							onClick={() => scrollTo({ y: 0 })}
						>
							Наверх
						</Button>
					)}
				</Transition>
			</Affix>
			<Header user={user} />
			<Component {...pageProps} />
		</NotificationsProvider>
	</MantineProvider>

}

export default MyApp
