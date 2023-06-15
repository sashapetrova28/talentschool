import Head from "next/head";
import styles from "./account.module.scss";

import useUser from "/lib/useUser.js";
import dynamic from "next/dynamic";
const CoursesControl = dynamic(
  () =>
    import("../../components/CoursesControl/Courses").then((e) => e.default),
  {
    ssr: false,
  }
);
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
        {user &&
          (user.status === "admin" || user.status === "curator") &&
          CoursesControl && <CoursesControl />}
      </Container>
    </div>
  );
};

export default Account;