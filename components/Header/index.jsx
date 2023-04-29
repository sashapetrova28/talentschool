import Link from "next/link";
import Image from "next/image";
import styles from "./header.module.scss";

import Logo from "/public/logo.png";
import {RiHomeLine, RiCheckDoubleFill, RiCameraLine} from 'react-icons/ri';
import {IoIosNotificationsOutline} from 'react-icons/io';
import { SmartHome, ListDetails, UserCircle, CameraSelfie, Checks } from "tabler-icons-react";
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
            {!(user?.status === "user") && (
              <>
                <Link href="/">
                  <div style={{ textAlign: "center", padding: "0 25px", cursor: "pointer"}}>
                    <div style={{
                      border: '2px solid rgb(51, 207, 189)', 
                      borderRadius: '8px', 
                      maxWidth: '40px', 
                      maxHeight: '40px',
                      minHeight: '40px',
                      minWidth: '40px',
                      padding: '5px'}}>
                      <RiHomeLine
                        size={24}
                        color='#33CFBD'/>
                      </div>
                  </div>
                </Link>
              </>
            )}
            <Link href={user?.status === "admin" ? "/account" : "/"}>
              <div style={{ textAlign: "center", padding: "0 25px", cursor: "pointer" }}>
              <div style={{
                      border: '2px solid rgb(51, 207, 189)', 
                      borderRadius: '8px', 
                      maxWidth: '40px', 
                      maxHeight: '40px',
                      minHeight: '40px',
                      minWidth: '40px',
                      padding: '5px'}}>
                <ListDetails 
                  size={24}
                  color='#33CFBD' />
                </div>
              </div>
            </Link>

            {!(user?.status === "user") && (
              <>
                <Link href="/check">
                  <div style={{ textAlign: "center", padding: "0 25px", cursor: "pointer" }}>
                  <div style={{
                      border: '2px solid rgb(51, 207, 189)', 
                      borderRadius: '8px', 
                      maxWidth: '40px', 
                      maxHeight: '40px',
                      minHeight: '40px',
                      minWidth: '40px',
                      padding: '5px'}}>
                    <RiCheckDoubleFill 
                      size={24}
                      borderRadius={5}
                      color='#33CFBD' />
                      </div>
                  </div>
                </Link>
              </>
            )}

            {user?.status === "admin" && (
              <>
                <Link href="/users">
                  <div style={{ textAlign: "center", padding: "0 25px", cursor: "pointer" }}>
                  <div style={{
                      border: '2px solid rgb(51, 207, 189)', 
                      borderRadius: '8px', 
                      maxWidth: '40px', 
                      maxHeight: '40px',
                      minHeight: '40px',
                      minWidth: '40px',
                      padding: '5px'}}>
                    <UserCircle 
                      size={24}
                      color='#33CFBD' />
                      </div>
                  </div>
                </Link>
              </>
            )}

            <Link href='/'>
              <div style={{ textAlign: "center", padding: "0 25px", cursor: "pointer" }}>
                <IoIosNotificationsOutline
                      size={24}
                      color='#33CFBD' />
              </div>
            </Link>

            <Link href="/profile">
              <div style={{ textAlign: "center", padding: "0 25px", cursor: "pointer" }}>
              <div style={{
                      border: '2px solid grey', 
                      borderRadius: '50%', 
                      maxWidth: '40px', 
                      maxHeight: '40px',
                      minHeight: '40px',
                      minWidth: '40px',
                      padding: '5px'}}>
                <RiCameraLine 
                  size={24}
                  color='grey' />
                  </div>
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
