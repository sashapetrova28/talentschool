import Head from "next/head";
import dynamic from "next/dynamic";
import styles from "../account/account.module.scss";

import useUser from "/lib/useUser.js";
const UsersControl = dynamic(() => import("/components/UsersControl"), {
  ssr: false,
});

import Container from "react-bootstrap/Container";

const Account = () => {
  const { user } = useUser({
    redirectTo: "/auth",
  });

  return (
    <div className={styles.container}>
      <Head>
        <title>Личный кабинет - Школа талантов</title>
        <meta name="description" content="Школа талантов" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container>
        {user && user.status === "admin" && <UsersControl />}
      </Container>
    </div>
  );
};

export default Account;