import Link from "next/link";
import Image from "next/image";
import styles from "./header.module.scss";

import Logo from "/public/logo.png";
import { CalendarEvent, SmartHome, ListDetails, UserCircle, CameraSelfie, Checks } from "tabler-icons-react";
import { Button, Card, Grid } from "@mantine/core";
import Container from "react-bootstrap/Container";

export const Header = ({ user }) => {
  if (!user?.isLoggedIn) return <></>;
  return (
    <Container>
      <Card style={{ height: "100px" }} shadow="sm" padding="lg" radius="md" withBorder>
        <Grid className={styles.header}>
          <div style={{ cursor: "pointer" }}>
            <Link href="/" passHref>
              <Image src={Logo} alt="Инкубатор талантов" width={200} height={77} />
            </Link>
          </div>
          <div className={styles.menu}>
            {user?.status === "admin" && (
              <>
                <Link href="/">
                  <div style={{ textAlign: "center", padding: "0 25px", cursor: "pointer" }}>
                    <SmartHome size={24} />
                    <div>Главная</div>
                  </div>
                </Link>
              </>
            )}
            <Link href={user?.status === "admin" ? "/account" : "/"}>
              <div style={{ textAlign: "center", padding: "0 25px", cursor: "pointer" }}>
                <ListDetails size={24} />
                <div>Курсы</div>
              </div>
            </Link>
            {user?.status === "admin" && (
              <>
                <Link href="/check">
                  <div style={{ textAlign: "center", padding: "0 25px", cursor: "pointer" }}>
                    <Checks size={24} />
                    <div>Проверка</div>
                  </div>
                </Link>
                <Link href="/users">
                  <div style={{ textAlign: "center", padding: "0 25px", cursor: "pointer" }}>
                    <UserCircle size={24} />
                    <div>Управление</div>
                  </div>
                </Link>
              </>
            )}

            <Link href="/profile">
              <div style={{ textAlign: "center", padding: "0 25px", cursor: "pointer" }}>
                <CameraSelfie size={24} />
                <div>Профиль</div>
              </div>
            </Link>
            {user && user?.email ? null : (
              <Link href="/auth" passHref>
                <Button variant="light">Войти</Button>
              </Link>
            )}
          </div>
        </Grid>
      </Card>
    </Container>
  );
};
