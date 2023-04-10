import { useEffect, useState } from "react";

import { Modal, Stack, Space, Button, useMantineTheme, Center, Table, SimpleGrid, Card } from "@mantine/core";
import { Plus, TrashX, Edit, List, Loader } from "tabler-icons-react";
import axios from "/utils/rest";

import { AddDay } from "./addDay";
import { DeleteDay } from "./deleteDay";
import { Tasks } from "../Tasks";

export const Days = ({ opened, setOpened, courseId }) => {
  const [addDayModalOpened, setAddDayModalOpened] = useState(false);
  const [deleteDayModalOpened, setDeleteDayModalOpened] = useState(false);
  const [editDayModalOpened, setEditDayModalOpened] = useState(false);
  const [tasksModalOpened, setTasksModalOpened] = useState(false);

  const [deleteDayId, setDeleteDayId] = useState(-1);
  const [editDayId, setEditDayId] = useState(-1);

  const [tasksId, setTasksId] = useState(-1);

  const [daysLoading, setDaysLoading] = useState(false);
  const [daysListError, setDaysListError] = useState(false);

  const [daysList, setDaysList] = useState([]);

  const theme = useMantineTheme();

  useEffect(() => {
    if (courseId !== -1) {
      setDaysList([]);
      setDaysLoading(true);
      axios
        .get(`/courses/${courseId}/days`)
        .then((res) => {
          setDaysList(res.data);
        })
        .catch((error) => {
          setDaysListError("Ошибка получения списка курсов");
        })
        .finally(() => {
          setDaysLoading(false);
        });
    }
  }, [courseId]);

  const pushDay = (day) => {
    setDaysList([...daysList, day]);
  };

  const removeDay = (id) => {
    const delete_index = daysList.findIndex((day) => day.id === id);
    if (delete_index !== -1) {
      daysList.splice(delete_index, 1);
      setDaysList(daysList);
    }
  };

  const updateDay = (updatedDay) => {
    const update_index = daysList.findIndex((day) => day.id === updatedDay.id);
    if (update_index !== -1) {
      daysList[update_index] = updatedDay;
      setDaysList(daysList);
    }
  };

  return (
    <div>
      <Space h="sm" />
      {!addDayModalOpened && <div style={{ color: "#036459", fontSize: "20px", fontWeight: "600" }}>Материалы</div>}
      <Space h="sm" />
      {!addDayModalOpened && ( //!addDayModalOpened && !tasksModalOpened
        <>
          <SimpleGrid cols={5}>
            <Card
              style={{ cursor: "pointer" }}
              shadow="sm"
              padding="lg"
              radius="md"
              withBorder
              onClick={() => setAddDayModalOpened(true)}
            >
              <div
                className="d-flex flex-column align-items-center"
                style={{ color: "#DFDFDF", fontWeight: "600", fontSize: "16px", height: "165px" }}
              >
                <div style={{ fontSize: "20px", marginTop: "42px" }}>+</div>
                <div>Добавить день</div>
              </div>
            </Card>
            {!daysLoading &&
              daysList.map((day) => {
                return (
                  <Card
                    style={{ cursor: "pointer" }}
                    shadow="sm"
                    padding="lg"
                    radius="md"
                    withBorder
                    key={day.id}
                    onClick={() => {
                      setTasksId(day.id);
                      setTasksModalOpened(true);
                    }}
                  >
                    <div className="d-flex flex-column justify-content-between" style={{ height: "165px" }}>
                      <div style={{ color: "#036459", fontWeight: "600", padding: "15px 0 0 15px" }}>{day.name}</div>
                      <Button
                        className="align-self-end"
                        size="xs"
                        variant="outline"
                        color="red"
                        leftIcon={<TrashX />}
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteDayId(day.id);
                          setDeleteDayModalOpened(true);
                        }}
                      >
                        Удалить
                      </Button>
                    </div>
                  </Card>
                );
              })}
          </SimpleGrid>
          {!daysLoading && daysList.length === 0 && <Center>Список дней пуст</Center>}
        </>
      )}
      {daysLoading && (
        <Center>
          <Loader color="orange" variant="bars" />
        </Center>
      )}
      <Center>{daysListError}</Center>
      {addDayModalOpened && (
        <AddDay opened={addDayModalOpened} setOpened={setAddDayModalOpened} pushDay={pushDay} courseId={courseId} />
      )}
      <DeleteDay
        opened={deleteDayModalOpened}
        setOpened={setDeleteDayModalOpened}
        removeDay={removeDay}
        courseId={courseId}
        deleteDayId={deleteDayId}
      />
      <Tasks opened={tasksModalOpened} setOpened={setTasksModalOpened} courseId={courseId} dayId={tasksId} />
    </div>
  );
};

{
  /* <Button
variant="outline"
color="blue"
leftIcon={<Edit />}
onClick={() => {
  setEditDayId(day.id);
  setEditDayModalOpened(true);
}}
>
Редактировать
</Button> */
}
