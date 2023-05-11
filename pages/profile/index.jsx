import Head from "next/head"
import styles from "../account/account.module.scss"

import { useRouter } from "next/router"
import Container from "react-bootstrap/Container"
import axios from "./../../utils/rest"
import { MyAccount } from "/components/MyAccount"
import useUser from "/lib/useUser.js"
import { Space } from "@mantine/core";

const Account = () => {
	const { user } = useUser({
		redirectTo: "/auth",
	})
	//  это нужно для redirect а после выхода
	const { push } = useRouter()

	const onLogOut = async () => {
		// асинхронно потому что api/users/logout тоже асинхронен ждем пока будет результат и перенеаправляем
		await axios("/user/logout")
		push("/auth")
	}

	return (
		<div className={styles.container}>
			<Head>
				<title>Личный кабинет - Школа талантов</title>
				<meta name='description' content='Школа талантов' />
				<link rel='icon' href='/favicon.ico' />
			</Head>

			<Container>
				<MyAccount user={user} />
        <Space h="xl" />
        {/* onClick получит свой onLogOut */}
			  <button className={styles.logout} onClick={onLogOut}>Выйти</button>
			</Container>
		</div>
	)
}

export default Account