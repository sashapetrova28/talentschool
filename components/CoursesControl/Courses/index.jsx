import { useState, useEffect } from "react";
import axios from "/utils/rest";

import { Space, Loader, Title, Button, Center, Table, Stack } from "@mantine/core";
import { Plus, TrashX, Edit, ListNumbers, List, FolderPlus } from "tabler-icons-react";
import Container from "react-bootstrap/Container";

import { AddCourse } from "./addCourse";
import { DeleteCourse } from "./deleteCourse";
import { EditCourse } from "./editCourse";
import { Main } from "./main";
import { Days } from "../Days";

export const CoursesControl = () => {
  const [addCourseModalOpened, setAddCourseModalOpened] = useState(false);
  const [deleteCourseModalOpened, setDeleteCourseModalOpened] = useState(false);
  const [editCourseModalOpened, setEditCourseModalOpened] = useState(false);
  const [daysModalOpened, setDaysModalOpened] = useState(false);

  const [deleteCourseId, setDeleteCourseId] = useState(-1);
  const [editCourseId, setEditCourseId] = useState(-1);
  const [courseId, setCourseId] = useState(-1);

  const [coursesLoading, setCoursesLoading] = useState(true);
  const [coursesList, setCoursesList] = useState([]);
  const [coursesListError, setCoursesListError] = useState("");

  useEffect(() => {
    axios
      .get("/courses")
      .then((res) => {
        setCoursesList(res.data);
      })
      .catch((error) => {
        setCoursesListError("Ошибка получения списка курсов");
      })
      .finally(() => {
        setCoursesLoading(false);
      });
  }, []);

  const pushCourse = (course) => {
    setCoursesList([course, ...coursesList]);
  };

  const removeCourse = (id) => {
    const delete_index = coursesList.findIndex((course) => course.id === id);
    if (delete_index !== -1) {
      coursesList.splice(delete_index, 1);
      setCoursesList(coursesList);
    }
  };

  const updateCourse = (updatedCourse) => {
    const update_index = coursesList.findIndex((course) => course.id === updatedCourse.id);
    if (update_index !== -1) {
      coursesList[update_index] = updatedCourse;
      setCoursesList(coursesList);
    }
  };

  return (
    <Container>
      <Space h="xl" />
      {!daysModalOpened && (
        <div className="d-flex align-items-center">
          <div style={{ color: "#036459", fontSize: "24px", fontWeight: "600" }}>
            Курсы{addCourseModalOpened && " > Добавление курса"}
            {editCourseModalOpened && " > Редактирование курса"}
          </div>{" "}
          {!addCourseModalOpened && !deleteCourseModalOpened && !editCourseModalOpened && !daysModalOpened && (
            <FolderPlus
              style={{ cursor: "pointer", marginLeft: "45px" }}
              size={32}
              color="#1FBEAC"
              onClick={() => setAddCourseModalOpened(true)}
            />
          )}
        </div>
      )}
      <Space h="xl" />
      {!addCourseModalOpened && !deleteCourseModalOpened && !editCourseModalOpened && !daysModalOpened && (
        <Main
          setDeleteCourseId={setDeleteCourseId}
          setDeleteCourseModalOpened={setDeleteCourseModalOpened}
          setAddCourseModalOpened={setAddCourseModalOpened}
          setEditCourseModalOpened={setEditCourseModalOpened}
          setEditCourseId={setEditCourseId}
          setDaysModalOpened={setDaysModalOpened}
          setCourseId={setCourseId}
          coursesLoading={coursesLoading}
          coursesListError={coursesListError}
          coursesList={coursesList}
        />
      )}
      {addCourseModalOpened && (
        <AddCourse opened={addCourseModalOpened} setOpened={setAddCourseModalOpened} pushCourse={pushCourse} />
      )}
      {deleteCourseModalOpened && (
        <DeleteCourse
          opened={deleteCourseModalOpened}
          setOpened={setDeleteCourseModalOpened}
          removeCourse={removeCourse}
          deleteCourseId={deleteCourseId}
        />
      )}
      {editCourseModalOpened && (
        <EditCourse
          opened={editCourseModalOpened}
          setOpened={setEditCourseModalOpened}
          updateCoursesList={updateCourse}
          editCourseId={editCourseId}
        />
      )}
    </Container>
  );
};
