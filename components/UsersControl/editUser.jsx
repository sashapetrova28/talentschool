import { useEffect, useState } from "react";

import {
  Button,
  Center,
  Input,
  InputWrapper,
  LoadingOverlay,
  Modal,
  NativeSelect,
  Space,
  Text,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { Check, Error404 } from "tabler-icons-react";
import axios from "/utils/rest";
import CryptoJS from "crypto-js";
const SECRET_KEY = process.env.NEXT_PUBLIC_SECRET_KEY;
export const EditUser = ({ opened, setOpened, updateUserList, editUserId }) => {
  const [loading, setLoading] = useState(false);

  const [editError, setEditError] = useState("");

  const [emailError, setEmailError] = useState("");
  const [nameError, setNameError] = useState("");
  const [ageError, setAgeError] = useState("");
  const [surnameError, setSurnameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [password_rError, setPassword_rError] = useState("");

  const [emailDefaultValue, setEmailDefaultValue] = useState("");
  const [nameDefaultValue, setNameDefaultValue] = useState("");
  const [surnameDefaultValue, setSurnameDefaultValue] = useState("");
  const [ageDefaultValue, setAgeDefaultValue] = useState("");
  const [passwordDefaultValue, setPasswordDefaultValue] = useState("");
  const [statusDefaultValue, setStatusDefaultValue] = useState("Ученик");
  useEffect(() => {
    if (editUserId !== -1) {
      setLoading(true);
      axios
        .get(`/user/${editUserId}`)
        .then((res) => {
          if (res.status === 200) {
            setEmailDefaultValue(res.data.email);
            setNameDefaultValue(res.data.name);
            setSurnameDefaultValue(res.data.surname);
            setAgeDefaultValue(res.data.age);
            res.data.status === "user"
              ? setStatusDefaultValue("Ученик")
              : "curator"
              ? setStatusDefaultValue("Куратор")
              : setStatusDefaultValue("Администратор");
            setLoading(false);
          }
        })
        .catch((error) => {
          if (error.response.status === "404") {
            showNotification({
              title: "Пользователь не найден",
              autoClose: 3500,
              color: "red",
              icon: <Error404 size={18} />,
            });
          } else {
            showNotification({
              title: "Ошибка получения пользователя",
              autoClose: 3500,
              color: "red",
              icon: <Error404 size={18} />,
            });
          }
          setOpened(false);
        })
        .finally(() => {});
    }
  }, [editUserId, setOpened]);

  const updateUser = (e) => {
    e.preventDefault();
    setEmailError("");
    setNameError("");
    setSurnameError("");
    setAgeError("");
    setPasswordError("");
    setPassword_rError("");
    setEditError("");
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

    if (e.target.age.value <= 0) {
      setAgeError("Введите возраст пользователя");
      return;
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
    const cipherPassword = CryptoJS.SHA256(
      e.target.password.value,
      SECRET_KEY
    ).toString();

    axios
      .put(`/user/${editUserId}`, {
        id: editUserId,
        email: e.target.email.value,
        name: e.target.name.value,
        surname: e.target.surname.value,
        password: cipherPassword,
        age: e.target.age.value,
        status:
          e.target.status.value === "Ученик"
            ? "user"
            : e.target.status.value === "Куратор"
            ? "curator"
            : "admin",
      })
      .then((res) => {
        if (res.status === 200) {
          updateUserList(res.data.user);
          showNotification({
            title: "Пользователь изменен",
            autoClose: 3500,
            color: "green",
            icon: <Check size={18} />,
          });
          setOpened(false);
        } else {
          setEditError("Ошибка редактирования пользователя, попробуйте позже");
        }
      })
      .catch((error) => {
        console.log(error);
        if (error.response.status === 409) {
          setEditError("Такая электронная почта уже зарегистрирована");
        } else {
          setEditError("Ошибка редактирования пользователя, попробуйте позже");
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Modal
      opened={opened}
      onClose={() => setOpened(false)}
      title="Редактировать пользователя"
      size="lg"
      transition="fade"
      transitionDuration={300}
      transitionTimingFunction="ease"
    >
      <form onSubmit={updateUser}>
        <LoadingOverlay visible={loading} />
        <InputWrapper
          required
          label="Электронная почта"
          description="Электронная почта пользователя"
          error={emailError}
        >
          <Input
            type="email"
            placeholder="example@example.com"
            name="email"
            value={emailDefaultValue}
            onChange={(event) =>
              setEmailDefaultValue(event.currentTarget.value)
            }
          />
        </InputWrapper>
        <InputWrapper
          required
          label="Имя"
          description="Имя пользователя"
          error={nameError}
        >
          <Input
            placeholder="Иван"
            type="text"
            name="name"
            value={nameDefaultValue}
            onChange={(event) => setNameDefaultValue(event.currentTarget.value)}
          />
        </InputWrapper>
        <InputWrapper
          required
          label="Фамилия"
          description="Фамилия пользователя"
          error={surnameError}
        >
          <Input
            placeholder="Иванов"
            type="text"
            name="surname"
            value={surnameDefaultValue}
            onChange={(event) =>
              setSurnameDefaultValue(event.currentTarget.value)
            }
          />
        </InputWrapper>
        <InputWrapper
          required
          label="Возраст"
          description="Возраст пользователя, числом"
          error={ageError}
        >
          <Input
            placeholder="20"
            type="number"
            name="age"
            value={ageDefaultValue}
            onChange={(event) => setAgeDefaultValue(event.currentTarget.value)}
          />
        </InputWrapper>
        <InputWrapper required label="Пароль" error={passwordError}>
          <Input
            placeholder="Введите пароль"
            type="password"
            name="password"
            value={passwordDefaultValue}
            onChange={(event) =>
              setPasswordDefaultValue(event.currentTarget.value)
            }
          />
        </InputWrapper>
        <InputWrapper required label="Повторите пароль" error={password_rError}>
          <Input
            placeholder="Введите пароль еще раз"
            type="password"
            name="password_r"
          />
        </InputWrapper>
        <NativeSelect
          value={statusDefaultValue}
          onChange={(event) => setStatusDefaultValue(event.currentTarget.value)}
          data={["Ученик", "Администратор", "Куратор"]}
          placeholder="Выберите вариант"
          label="Выберите роль пользователя"
          description="Ученик может проходить курсы.
		  			Куратор отвечает за проверку заданий.
					Администратор отвечает за проверку заданий и создание курсов, дней, заданий."
          required
          name="status"
        />
        <Space h="md" />
        <Center>
          <Button color="green" type="submit" style={{ marginRight: "20px" }}>
            Сохранить
          </Button>
          <Button
            variant="light"
            color="dark"
            onClick={() => {
              setOpened(false);
            }}
          >
            Отменить
          </Button>
        </Center>
        <Center>
          <Text color="red">{editError}</Text>
        </Center>
      </form>
    </Modal>
  );
};