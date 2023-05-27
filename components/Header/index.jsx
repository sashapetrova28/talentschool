import Link from "next/link";
import Image from "next/image";
import styles from "./header.module.scss";

import Logo from "/public/logo.png";
import { RiHomeLine, RiCheckDoubleFill, RiCameraLine } from 'react-icons/ri';
import { MdOutlineManageAccounts } from 'react-icons/md';
import { HiOutlineUserCircle } from 'react-icons/hi';
import { TbListDetails } from 'react-icons/tb';
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
              <Image src={Logo} alt="Школа талантов" width={200} height={55} />
            </Link>
          </div>
          <div className={styles.menu}>
            {!(user?.status === "user") && (
              <>
                <Link href="/">
                  <div style={{ textAlign: "center", padding: "0 25px", cursor: "pointer"}}>
                    <RiHomeLine size={38} className={styles.item} />
                  </div>
                </Link>
              </>
            )}
            <Link href={user?.status === "admin" ? "/account" : "/"}>
              <div style={{ textAlign: "center", padding: "0 25px", cursor: "pointer" }}>
                <TbListDetails size={38} className={styles.item} />
              </div>
            </Link>

            {!(user?.status === "user") && (
              <>
                <Link href="/check">
                  <div style={{ textAlign: "center", padding: "0 25px", cursor: "pointer" }}>
                    <RiCheckDoubleFill size={38} className={styles.item} />
                  </div>
                </Link>
              </>
            )}

            {user?.status === "admin" && (
              <>
                <Link href="/users">
                  <div style={{ textAlign: "center", padding: "0 25px", cursor: "pointer" }}>
                    <MdOutlineManageAccounts size={38} className={styles.item} />
                  </div>
                </Link>
              </>
            )}

            <Link href="/profile">
              <div style={{ textAlign: "center", padding: "0 25px", cursor: "pointer" }}>
                <HiOutlineUserCircle size={38} className={styles.item} />
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
