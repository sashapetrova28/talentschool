import { useEffect, useState } from "react";
import axios from "/utils/rest";

import { Space, Loader, Title, Button, Center, Table, Stack } from "@mantine/core";
import { Plus, TrashX, Edit } from "tabler-icons-react";
import Container from "react-bootstrap/Container";

import { AddUser } from "./addUser";
import { DeleteUser } from "./deleteUser";
import { EditUser } from "./editUser";

export const UsersControl = () => {
  const [addUserModalOpened, setAddUserModalOpened] = useState(false);
  const [deleteUserModalOpened, setDeleteUserModalOpened] = useState(false);
  const [editUserModalOpened, setEditUserModalOpened] = useState(false);

  const [usersLoading, setUsersLoading] = useState(true);
  const [usersList, setUsersList] = useState([]);
  const [usersListError, setUsersListError] = useState("");

  const [deleteUserId, setDeleteUserId] = useState(-1);
  const [editUserId, setEditUserId] = useState(-1);

  const pushUser = (user) => {
    setUsersList([user, ...usersList]);
  };

  const removeUser = (id) => {
    const delete_index = usersList.findIndex((user) => user.id === id);
    if (delete_index !== -1) {
      usersList.splice(delete_index, 1);
      setUsersList(usersList);
    }
  };

  const updateUser = (updatedUser) => {
    const update_index = usersList.findIndex((user) => user.id === updatedUser.id);
    if (update_index !== -1) {
      usersList[update_index] = updatedUser;
      setUsersList(usersList);
    }
  };

  useEffect(() => {
    axios
      .get("/users")
      .then((res) => {
        setUsersList(res.data);
      })
      .catch((error) => {
        setUsersListError("Ошибка получения пользователей");
      })
      .finally(() => {
        setUsersLoading(false);
      });
  }, []);

  return (
    <Container>
      <Space h="xl" />
      <div style={{ color: "#036459", fontSize: "24px", fontWeight: "600" }}>Пользователи</div>
      {!addUserModalOpened && (
        <>
          {" "}
          <button
            style={{
              fontSize: "16px",
              color: "white",
              fontWeight: "600",
              padding: "10px",
              borderRadius: "5px",
              border: "none",
              backgroundColor: "#1FBEAC",
            }}
            onClick={() => setAddUserModalOpened(true)}
          >
            Добавить пользователя
          </button>
          <Space h="xl" />
          <Table verticalSpacing="sm" striped highlightOnHover style={{ color: "#036459", fontWeight: "600" }}>
            <thead>
              <tr>
                <th>Роль</th>
                <th>Фамилия, имя</th>
                <th>Электронная почта</th>
                <th>Пароль</th>
                <th></th>
              </tr>
            </thead>
            <tbody style={{ color: "#036459", fontWeight: "500" }}>
              {!usersLoading &&
                usersList.map((user) => {
                  return (
                    <tr key={user.id}>
                      <td>
                        {user.status === "user" ? "Ученик" : user.status === "curator" ? "Куратор" : "Администратор"}
                      </td>
                      <td>
                        {user.surname} {user.name}
                      </td>
                      <td>{user.email}</td>
                      <td>{user.password}</td>
                      <td>
                        <Button
                          variant="subtle"
                          color="dark"
                          leftIcon={<Edit style={{ color: "#33CFBD" }} />}
                          onClick={() => {
                            setEditUserId(user.id);
                            setEditUserModalOpened(true);
                          }}
                        ></Button>
                        <Button
                          variant="subtle"
                          color="dark"
                          leftIcon={<TrashX style={{ color: "#E74750" }} />}
                          onClick={() => {
                            setDeleteUserId(user.id);
                            setDeleteUserModalOpened(true);
                          }}
                        ></Button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </Table>
          {usersLoading && (
            <Center>
              <Loader color="orange" variant="bars" />
            </Center>
          )}
          {!usersLoading && usersList.length === 0 && <Center>Список пользователей пуст</Center>}
          <Center>{usersListError}</Center>
        </>
      )}
      {addUserModalOpened && <AddUser setOpened={setAddUserModalOpened} pushUser={pushUser} />}
      <DeleteUser
        opened={deleteUserModalOpened}
        setOpened={setDeleteUserModalOpened}
        removeUser={removeUser}
        deleteUserId={deleteUserId}
      />
      <EditUser
        opened={editUserModalOpened}
        setOpened={setEditUserModalOpened}
        updateUserList={updateUser}
        editUserId={editUserId}
      />
    </Container>
  );
};
