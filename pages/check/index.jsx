import Head from "next/head";
import styles from "../account/account.module.scss";

import useUser from "/lib/useUser.js";
import { TasksCheck } from "/components/TasksCheck";
import Container from "react-bootstrap/Container";

const Account = () => {
  const { user } = useUser({
    redirectTo: "/auth",
  });

  return (
    <div className={styles.container}>
      <Head>
        <title>Проверка заданий</title>
        <meta name="description" content="Инкубатор талантов" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container>{user && user.status === "admin" && <TasksCheck />}</Container>
    </div>
  );
};

export default Account;
