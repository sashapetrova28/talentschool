import { useState } from "react";

import { Modal, InputWrapper, Input, Center, NativeSelect, Space, Button, LoadingOverlay, Text } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { Check } from "tabler-icons-react";
import axios from "/utils/rest";
import { Row, Col } from "react-bootstrap";
import styles from './Users.module.scss'

export const AddUser = ({ opened, setOpened, pushUser }) => {
  const [loading, setLoading] = useState(false);

  const [addError, setAddError] = useState("");

  const [emailError, setEmailError] = useState("");
  const [nameError, setNameError] = useState("");
  const [ageError, setAgeError] = useState("");
  const [surnameError, setSurnameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [password_rError, setPassword_rError] = useState("");

  const saveUser = (e) => {
    e.preventDefault();
    setAddError("");
    setEmailError("");
    setNameError("");
    setSurnameError("");
    setAgeError("");
    setPasswordError("");
    setPassword_rError("");
    if (e.target.email.value === "") {
      setEmailError("Введите электронную почту");
      return;
    }

    if (e.target.name.value === "") {
      setNameError("Введите имя пользователя");
      return;
    }

    if (e.target.surname.value === "") {
      setSurnameError("Введите фамилию пользователя");
      return;
    }

    if (true) {
      setAgeError(18);
    }

    if (e.target.password.value === "") {
      setPasswordError("Введите пароль пользователя");
      return;
    }

    if (e.target.password_r.value !== e.target.password.value) {
      setPassword_rError("Пароли не совпадают");
      return;
    }
    setLoading(true);

    axios
      .post("/users", {
        email: e.target.email.value,
        name: e.target.name.value,
        surname: e.target.surname.value,
        password: e.target.password.value,
        age: 18,
        status: e.target.status.value === "Ученик" ? "user" : e.target.status.value === "Куратор" ? "curator" : "admin",
      })
      .then((res) => {
        if (res.status === 200) {
          pushUser(res.data);
          showNotification({
            title: "Пользователь добавлен",
            autoClose: 3500,
            color: "green",
            icon: <Check size={18} />,
          });
          e.target.reset();
        } else {
          setAddError("Ошибка добавления пользователя, попробуйте позже");
        }
      })
      .catch((error) => {
        console.log(error);
        if (error.response.status === 409) {
          setAddError("Пользователь уже существует");
        } else {
          setAddError("Ошибка добавления пользователя, попробуйте позже");
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div
      opened={opened}
      onClose={() => setOpened(false)}
      title='Добавить пользователя'
      size='lg'
      transition='fade'
      transitionDuration={300}
      transitionTimingFunction='ease'
    >
      <form className={styles.form} onSubmit={saveUser}>
        <LoadingOverlay visible={loading} />
        <div className={styles.buttons}>
          <button
            className='greenButton'
            color='green'
            type='submit'
            style={{ marginRight: '20px' }}
          >
            Добавить
          </button>
          <button
            className='redButton'
            variant='light'
            color='dark'
            onClick={() => {
              setOpened(false);
            }}
          >
            Отменить
          </button>
        </div>
        <Row className={styles.row}>
          <Col>
            <div
              className={styles.title__row}
              style={{
                fontWeight: '600',
                fontSize: '16px',
                color: '#036459',
                marginBottom: '28px'
              }}
            >
              Роль
            </div>
            <NativeSelect
              style={inputStyles}
              data={['Ученик', 'Администратор', 'Куратор']}
              placeholder='Выберите вариант'
              name='status'
            />
          </Col>
          <Col>
            <div
              className={styles.title__row}
              style={{
                fontWeight: '600',
                fontSize: '16px',
                color: '#036459',
                marginBottom: '28px'
              }}
            >
              Фамилия, имя
            </div>
            <InputWrapper className='mb-2' required error={surnameError}>
              <Input
                style={inputStyles}
                placeholder='Введите фамилию'
                type='text'
                name='surname'
              />
            </InputWrapper>
            <InputWrapper required error={nameError}>
              <Input
                style={inputStyles}
                placeholder='Введите имя'
                type='text'
                name='name'
              />
            </InputWrapper>
          </Col>
          <Col>
            <div
              className={styles.title__row}
              style={{
                fontWeight: '600',
                fontSize: '16px',
                color: '#036459',
                marginBottom: '28px'
              }}
            >
              Электронная почта
            </div>
            <InputWrapper required error={emailError}>
              <Input
                style={inputStyles}
                type='email'
                placeholder='Введите адрес эл. почты'
                name='email'
              />
            </InputWrapper>
          </Col>
          <Col>
            <div
              className={styles.title__row}
              style={{
                fontWeight: '600',
                fontSize: '16px',
                color: '#036459',
                marginBottom: '28px'
              }}
            >
              Пароль
            </div>
            <InputWrapper className='mb-2' required error={passwordError}>
              <Input
                style={inputStyles}
                placeholder='Пароль'
                type='text'
                name='password'
              />
            </InputWrapper>
            <InputWrapper required error={password_rError}>
              <Input
                style={inputStyles}
                placeholder='Повторите пароль'
                type='text'
                name='password_r'
              />
            </InputWrapper>
          </Col>
        </Row>
        <Center>
          <Text color='red'>{addError}</Text>
        </Center>
      </form>
    </div>
  );
};

const inputStyles = { border: "2px solid #33CFBD", borderRadius: "8px", boxShadow: "0px 2px 20px #BBBBBB" };