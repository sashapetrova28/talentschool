import { Center, Loader, NativeSelect, Space, Table } from "@mantine/core"
import { useCallback, useEffect, useState } from "react"
import Col from "react-bootstrap/Col"
import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import { Answer } from "./answer"
import useUser from "/lib/useUser"
import axios from "/utils/rest"

export const TasksCheck = () => {
  const [answerModalOpened, setAnswerModalOpened] = useState(false);
  const { user } = useUser();
  const [task, setTask] = useState(-1);

  const [tasksLoading, setTasksLoading] = useState(true);
  const [tasksList, setTasksList] = useState([]);
  const [tasksListError, setTasksListError] = useState("");
  const [filter, setFilter] = useState([]);

  const handleFilter = useCallback(
    (key, value) => {
      if (value == "Не выбрано") {
        setFilter(tasksList);
        return;
      }
      const newArr = filter.filter((task) => {
        return value.match(task[key].name);
      });
      setFilter(newArr);
    },
    [tasksList, filter]
  );

  useEffect(() => {
    axios
      .get("/to_check")
      .then((res) => {
        setTasksList(res.data);
        setFilter(res.data);
      })
      .catch(() => {
        setTasksListError("Ошибка получения списка курсов");
      })
      .finally(() => {
        setTasksLoading(false);
      });
  }, [answerModalOpened, user]);

  return (
    <Container>
      <Space h="xl" />
      <div style={{ color: "#036459", fontSize: "24px", fontWeight: "600" }}>
        Задания
      </div>
      <Space h="xl" />
      <Row>
        <Col md={4}>
          <NativeSelect
            data={["Не выбрано"].concat(
              Array.from(new Set(tasksList?.map((e) => e?.course?.name || "")))
            )}
            onChange={(event) =>
              handleFilter("course", event?.currentTarget?.value || "")
            }
            description="Выберите курс"
            variant="filled"
          />
        </Col>
        <Col md={4}>
          <NativeSelect
            data={["Не выбрано"].concat(
              Array.from(
                new Set(
                  tasksList?.map((e) => `${e?.user?.name} ${e?.user?.surname}`)
                )
              )
            )}
            onChange={(event) =>
              handleFilter("user", event?.currentTarget?.value)
            }
            description="Выберите ученика"
            variant="filled"
          />
        </Col>
        <Col md={4}>
          <NativeSelect
            value={{}}
            data={["Не выбрано"].concat(
              Array.from(new Set(tasksList?.map((e) => e?.day?.name)))
            )}
            onChange={(event) => {
              handleFilter("day", event?.currentTarget?.value);
            }}
            description="Выберите день"
            variant="filled"
          />
        </Col>
      </Row>
      <Table verticalSpacing="sm" striped highlightOnHover>
        <thead>
          <tr>
            <th>День</th>
            <th>Задание</th>
            {/* <th>Талант</th>
            <th>Email таланта</th> */}
            <th>Фамилия, Имя</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {!tasksLoading &&
            filter?.map((task) => {
              return (
                <tr
                  key={
                    task.task.id +
                    Math.random() * new Date().getMilliseconds() +
                    Math.random()
                  }
                  style={{
                    border: "2px solid #33CFBD",
                    borderRadius: "8px",
                    background: "white",
                  }}
                >
                  <td>{task?.day?.name}</td>
                  <td>{task?.task?.name}</td>
                  <td>{`${task?.user?.name} ${task?.user?.surname}`}</td>
                  {/* <td>{task.user.email}</td> */}
                  <td>
                    {/* <Button
                          variant="outline"
                          color="orange"
                          leftIcon={<MessageCircle />}
                          onClick={() => {
                            setTask(task);
                            setAnswerModalOpened(true);
                          }}
                        >
                          Просмотреть
                        </Button> */}
                    <button
                      style={{
                        fontSize: "16px",
                        color: "#1FBEAC",
                        fontWeight: "600",
                        marginRight: "35px",
                        border: "none",
                        backgroundColor: "white",
                      }}
                      onClick={() => {
                        setTask(task);
                        setAnswerModalOpened(true);
                      }}
                      type="submit"
                    >
                      Проверить
                    </button>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </Table>
      {tasksLoading && (
        <Center>
          <Loader color="orange" variant="bars" />
        </Center>
      )}
      {!tasksLoading && tasksList.length === 0 && (
        <Center>Список заданий для проверки пуст</Center>
      )}
      <Center>{tasksListError}</Center>
      <Answer
        opened={answerModalOpened}
        setOpened={setAnswerModalOpened}
        task={task}
      />
    </Container>
  );
};