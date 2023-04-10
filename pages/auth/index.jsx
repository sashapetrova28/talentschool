import { useState } from "react";
import axios from "/utils/rest";
import Head from "next/head";
import Image from "next/image";
import styles from "./auth.module.scss";

import Logo from "/public/logo.png";
import useUser from "/lib/useUser.js";

import { Card, Input, InputWrapper, Button, Center, Text } from "@mantine/core";
import { At, Lock } from "tabler-icons-react";

const Auth = () => {
  const { mutateUser } = useUser({
    redirectTo: "/",
    redirectIfFound: true,
  });

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [error, setError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  const auth = (e) => {
    e.preventDefault();
    setError("");
    setEmailError("");
    setPasswordError("");
    if (e.target.email.value.length === 0) {
      setEmailError("Введите электронную почту");
      return;
    }
    if (e.target.password.value.length === 0) {
      setPasswordError("Введите пароль");
      return;
    }
    setAuthLoading(true);
    axios
      .post("/auth", {
        email: e.target.email.value,
        password: e.target.password.value,
      })
      .then((res) => {
        if (res.status === 200) {
          mutateUser(res.data);
        }
      })
      .catch((error) => {
        console.log(error.response.status);
        if (error.response.status === 404) {
          setError("Пользователь не найден");
        } else if (error.response.status === 403) {
          setError("Неверный пароль");
        }
      })
      .finally(() => {
        setAuthLoading(false);
      });
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Войти - Инкубатор талантов</title>
        <meta name="description" content="Инкубатор талантов" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.authContainer}>
        <div style={{ textAlign: "center" }}>
          <Image src={Logo} height={150} width={350} alt="Инкубатор талантов" />
        </div>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <form onSubmit={auth}>
            <InputWrapper label="Почта" required style={{ marginTop: "20px" }} size="md" error={emailError}>
              <Input
                type="email"
                name="email"
                radius="lg"
                size="lg"
                icon={<At />}
                placeholder="Ваша электронная почта"
              />
            </InputWrapper>
            <InputWrapper label="Пароль" required style={{ marginTop: "20px" }} size="md" error={passwordError}>
              <Input type="password" name="password" radius="lg" size="lg" icon={<Lock />} placeholder="Ваш пароль" />
            </InputWrapper>
            <Center style={{ marginTop: "20px" }}>
              <Button
                style={{ color: "#1FBEAC", borderColor: "#1FBEAC" }}
                fullWidth
                variant="outline"
                size="lg"
                radius="xl"
                type="submit"
                loading={authLoading}
              >
                Войти
              </Button>
            </Center>
            <Center>
              <Text color="red">{error}</Text>
            </Center>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
