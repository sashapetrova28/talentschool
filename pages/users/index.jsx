import Head from "next/head";
import styles from "../account/account.module.scss";

import useUser from "/lib/useUser.js";
import { MyAccount } from "/components/MyAccount";
import { CoursesControl } from "/components/CoursesControl/Courses";
import { UsersControl } from "/components/UsersControl";
import { TasksCheck } from "/components/TasksCheck";

import { Tabs } from "@mantine/core";
import { ListCheck, Users, ListDetails, User, Settings, Checks } from "tabler-icons-react";
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

      <Container>{user && user.status === "admin" && <UsersControl />}</Container>
    </div>
  );
};

export default Account;
