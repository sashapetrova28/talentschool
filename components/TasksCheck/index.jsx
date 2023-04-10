import { useState, useEffect } from "react";
import axios from "/utils/rest";

import { Space, Loader, NativeSelect, Title, Button, Center, Table } from "@mantine/core";
import { MessageCircle } from "tabler-icons-react";
import { Answer } from "./answer";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

export const TasksCheck = () => {
  const [answerModalOpened, setAnswerModalOpened] = useState(false);

  const [task, setTask] = useState(-1);

  const [tasksLoading, setTasksLoading] = useState(true);
  const [tasksList, setTasksList] = useState([]);
  const [tasksListError, setTasksListError] = useState("");
  const [filter, setFilter] = useState({});
  const [coursesNames, setCoursesNames] = useState({});

  useEffect(() => {
    axios
      .get("/to_check")
      .then((res) => {
        setTasksList(res.data);
        let arr = Array.from(new Set(res.data.map((e) => e.day).map((e) => e.course_id)));
        const obj = {};
        arr.map((e) => {
          axios.get(`/courses/${e}`).then((res) => {
            obj[`${e}`] = res.data.name;
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
  }, [answerModalOpened]);

  function handleFilter(key, value) {
    setFilter((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <Container>
      <Space h="xl" />
      <div style={{ color: "#036459", fontSize: "24px", fontWeight: "600" }}>Проверка заданий</div>
      <Space h="xl" />
      <Row>
        <Col md={4}>
          <NativeSelect
            data={["Не выбрано"].concat(
              Array.from(new Set(tasksList?.map((e) => coursesNames[e.day.course_id] || "")))
            )}
            onChange={(event) => handleFilter("course", event.currentTarget.value)}
            description="Выберите курс"
            variant="filled"
          />
        </Col>
        <Col md={4}>
          <NativeSelect
            data={["Не выбрано"].concat(Array.from(new Set(tasksList?.map((e) => `${e.user.name} ${e.user.surname}`))))}
            onChange={(event) => handleFilter("user", event.currentTarget.value)}
            description="Выберите таланта"
            variant="filled"
          />
        </Col>
        <Col md={4}>
          <NativeSelect
            data={["Не выбрано"].concat(Array.from(new Set(tasksList?.map((e) => e.day.name))))}
            onChange={(event) => handleFilter("day", event.currentTarget.value)}
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
            <th>Талант</th>
            <th>Email таланта</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {!tasksLoading &&
            tasksList
              .filter(
                (e) => coursesNames[e.day.course_id] == filter.course || filter.course == "Не выбрано" || !filter.course
              )
              .filter(
                (e) => `${e.user.name} ${e.user.surname}` == filter.user || filter.user == "Не выбрано" || !filter.user
              )
              .filter((e) => e.day.name == filter.day || filter.day == "Не выбрано" || !filter.day)
              .map((task, i) => {
                return (
                  <tr key={task.task.id}>
                    <td>{task.day.name}</td>
                    <td>{task.task.name}</td>
                    <td>{`${task.user.name} ${task.user.surname}`}</td>
                    <td>{task.user.email}</td>
                    <td>
                      <Center>
                        <Button
                          variant="outline"
                          color="orange"
                          leftIcon={<MessageCircle />}
                          onClick={() => {
                            setTask(task);
                            setAnswerModalOpened(true);
                          }}
                        >
                          Просмотреть
                        </Button>
                      </Center>
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
      {!tasksLoading && tasksList.length === 0 && <Center>Список заданий для проверки пуст</Center>}
      <Center>{tasksListError}</Center>
      <Answer opened={answerModalOpened} setOpened={setAnswerModalOpened} task={task} />
    </Container>
  );
};
