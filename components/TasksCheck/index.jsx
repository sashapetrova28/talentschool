import { useState, useEffect } from "react";
import axios from "/utils/rest";
import useUser from "/lib/useUser";
import {
  Space,
  Loader,
  NativeSelect,
  Title,
  Button,
  Center,
  Table,
} from "@mantine/core";
import { MessageCircle } from "tabler-icons-react";
import { Answer } from "./answer";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

export const TasksCheck = () => {
  const [answerModalOpened, setAnswerModalOpened] = useState(false);
  const { user } = useUser();
  const [task, setTask] = useState(-1);

  const [tasksLoading, setTasksLoading] = useState(true);
  const [tasksList, setTasksList] = useState([]);
  const [tasksListError, setTasksListError] = useState("");
  const [filter, setFilter] = useState([]);
  const [coursesNames, setCoursesNames] = useState({});
  useEffect(() => {
    axios
      .get("/to_check")
      .then((res) => {
        if (user.status === "curator") {
          setTasksList(
            res.data.filter((info) => info.user.status === "curator")
          );
          setFilter(tasksList);
        } else {
          setTasksList(res.data);
          setFilter(tasksList);
        }
        let arr = Array.from(
          new Set(res.data.map((e) => e.day).map((e) => e.course_id))
        );
        const obj = {};
        arr.map((course_id) => {
          axios.get(`/courses/${course_id}`).then((res) => {
            obj[`${course_id}`] = res.data.name;
            setCoursesNames(obj);
          });
        });
      })
      .catch((error) => {
        setTasksListError("Ошибка получения списка курсов");
      })
      .finally(() => {
        setTasksLoading(false);
      });
  }, [answerModalOpened, user]);
  function handleFilter(key, value) {
    setFilter((prev) => {
      const some = prev.filter((prevf) => !prevf[key]?.name?.match(value));
      console.log(some);
      return prev;
    });
  }
  const filterByDay = (value) => {
    if (value == "Не выбрано") {
      return setFilter(tasksList);
    }
    const filtered = tasksList.filter((item) => {
      return item.day.name.match(value);
    });
    console.log(filtered);
    setFilter(filtered);
  };
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
              Array.from(
                new Set(
                  tasksList?.map((e) => coursesNames[e.day.course_id] || "")
                )
              )
            )}
            onChange={(event) =>
              handleFilter("course", event.currentTarget.value)
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
                  tasksList?.map((e) => `${e.user.name} ${e.user.surname}`)
                )
              )
            )}
            onChange={(event) =>
              handleFilter("user", event.currentTarget.value)
            }
            description="Выберите ученика"
            variant="filled"
          />
        </Col>
        <Col md={4}>
          <NativeSelect
            data={["Не выбрано"].concat(
              Array.from(new Set(tasksList?.map((e) => e.day.name)))
            )}
            onChange={(event) => {
              filterByDay(event.currentTarget.value);
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
            tasksList?.map((task, i) => {
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
                  <td>{task.day.name}</td>
                  <td>{task.task.name}</td>
                  <td>{`${task.user.name} ${task.user.surname}`}</td>
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