import { Center, Loader, NativeSelect, Space, Table } from "@mantine/core"
import { useEffect, useMemo, useState } from "react"
import Col from "react-bootstrap/Col"
import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import { Answer } from "./answer"
import useUser from "/lib/useUser"
import axios from "/utils/rest"

const notSelected = "Не выбрано"

export const TasksCheck = () => {
  const [answerModalOpened, setAnswerModalOpened] = useState(false);
  const { user } = useUser();
  const [task, setTask] = useState(-1);

  const [tasksLoading, setTasksLoading] = useState(true);
  const [tasksList, setTasksList] = useState([]);
  const [tasksListError, setTasksListError] = useState("");
  const [filter, setFilter] = useState([]);


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

  const [userNameFilter, setUserNameFilter] = useState(notSelected);
  const [dayNameFilter, setDayNameFilter] = useState(notSelected);
  const [courseNameFilter, setCourseNameFilter] = useState(notSelected);

  const handleUserNameFilterChange = (e) => {
    const value = e?.currentTarget?.value;
    setUserNameFilter(value);
    filterData(value, dayNameFilter, courseNameFilter);
  };

  const handleDayNameFilterChange = (e) => {
    const value = e?.currentTarget?.value;
    setDayNameFilter(value);
    filterData(userNameFilter, value, courseNameFilter);
  };

  const handleCourseNameFilterChange = (e) => {
    const value = e.currentTarget?.value;
    setCourseNameFilter(value);
    filterData(userNameFilter, dayNameFilter, value);
  };

  const users = useMemo(() => [notSelected].concat(
    Array.from(
      new Set(
        tasksList?.map((e) => `${e?.user?.name} ${e?.user?.surname}`)
      )
    )
  ), [tasksList])

  const days = useMemo(() => [notSelected].concat(
    Array.from(new Set(tasksList?.map((e) => e?.day?.name)))
  ), [tasksList])
  const courses = useMemo(() => [notSelected].concat(
    Array.from(new Set(tasksList?.map((e) => e?.course?.name || "")))
  ), [tasksList])
  const filterData = (userName, dayName, courseName) => {
    const filteredArray = tasksList.filter((item) => {
      const matchUserName = userName == notSelected || userName.match(item?.user?.name);
      const matchDayName = dayName == notSelected || dayName.match(item?.day?.name);
      const matchCourseName =
        courseName == notSelected || courseName.match(item?.course?.name);

      return matchUserName && matchDayName && matchCourseName;
    });

    setFilter(filteredArray);
  };


  useEffect(() => {
    let taksTimeoot = setTimeout(() => {
      setFilter(tasksList)
    }, 200)
    return () => clearTimeout(taksTimeoot)
  }, [tasksList])
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
            value={courseNameFilter}
            data={courses}
            onChange={handleCourseNameFilterChange}
            description="Выберите курс"
            variant="filled"
          />
        </Col>
        <Col md={4}>
          <NativeSelect
            value={userNameFilter}
            data={users}
            onChange={handleUserNameFilterChange}
            description="Выберите ученика"
            variant="filled"
          />
        </Col>
        <Col md={4}>
          <NativeSelect
            value={dayNameFilter}
            data={days}
            onChange={handleDayNameFilterChange}
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
                  <td>
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