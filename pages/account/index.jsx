import Head from "next/head";
import styles from "./account.module.scss";

import useUser from "/lib/useUser.js";
import { CoursesControl } from "/components/CoursesControl/Courses";

import Container from "react-bootstrap/Container";

const Account = () => {
  const { user } = useUser({
    redirectTo: "/auth",
  });

  return (
    <div className={styles.container}>
      <Head>
        <title>Личный кабинет - Инкубатор талантов</title>
        <meta name="description" content="Инкубатор талантов" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container >
        {user && user.status === "admin" && <CoursesControl />}
      </Container>
    </div>
  );
};

export default Account;
