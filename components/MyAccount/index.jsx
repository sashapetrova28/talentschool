import styles from "./myAccount.module.scss";

import { Space, Text, Title } from "@mantine/core";

export const MyAccount = ({ user }) => {

  return (
    <>
      <Space h='xl' />
      <div
        className={styles.account}
        style={{ color: '#036459', fontSize: '24px', fontWeight: '600' }}
      >
        Мой аккаунт
      </div>
      <Space h='xl' />
      {user && user.email && (
        <>
          <Text className={styles.text} weight={500}>
            Электронная почта: {user.email}
          </Text>
          <Text className={styles.text} weight={500}>
            Имя: {user.name}
          </Text>
          <Text className={styles.text} weight={500}>
            Фамилия: {user.surname}
          </Text>
          <Text className={styles.text} weight={500}>
            Возраст: {user.age}
          </Text>
        </>
      )}
    </>
  );
};
