import { useState, useEffect } from "react";
import axios from "/utils/rest";

import {
  Space,
  Loader,
  Card,
  SimpleGrid,
  Button,
  Center,
  Image,
} from "@mantine/core";
import { TrashX } from "tabler-icons-react";
import { useRouter } from "next/router";

export const Main = ({
  setAddCourseModalOpened,
  setEditCourseModalOpened,
  setEditCourseId,
  setDaysModalOpened,
  coursesLoading,
  coursesListError,
  coursesList,
  setCourseId,
  setDeleteCourseId,
  setDeleteCourseModalOpened,
}) => {
  const [daysCount, setDaysCount] = useState([]);
  useEffect(() => {
    coursesList.map((course) => {
      axios
        .get(`/courses/${course.id}/days`)
        .then((res) => setDaysCount((prev) => [...prev, res.data.length]));
    });
  }, []);
  const router = useRouter();
  return (
    <div>
      <Space h="xl" />
      <SimpleGrid cols={3}>
        {!coursesLoading &&
          coursesList?.map((course, index) => {
            return (
              <Card
                onClick={() => {
                  setEditCourseId(course.id);
                  router.push("?edit=true");
                  setEditCourseModalOpened(true);
                }}
                key={course.id}
                shadow="sm"
                padding="lg"
                radius="md"
                withBorder
                style={{
                  cursor: "pointer",
                  position: "relative",
                  paddingBottom: "45px",
                }}
              >
                <div
                  style={{
                    fontSize: "16px",
                    fontWeight: "600",
                    color: "#036459",
                    marginBottom: "24px",
                  }}
                >
                  {course.name}
                </div>
                <div className="d-flex align-items-center">
                  <div style={{ paddingRight: "20px" }}>
                    {course.image && (
                      <Image
                        radius={100}
                        src={"/" + course.image}
                        width={100}
                        height={100}
                        alt="Школа талантов"
                      />
                    )}
                  </div>
                  <table style={{ width: "50%" }}>
                    <tr>
                      <td
                        style={{
                          fontSize: "16px",
                          color: "#036459",
                          fontWeight: "600",
                        }}
                      >
                        Участников
                      </td>
                      <td style={{ textAlign: "left" }}>
                        <span
                          style={{
                            color: "#1FBEAC",
                            fontSize: "20px",
                            fontWeight: "600",
                          }}
                        >
                          {course.selected_users}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td
                        style={{
                          fontSize: "16px",
                          color: "#036459",
                          fontWeight: "600",
                        }}
                      >
                        Дней
                      </td>
                      <td style={{ textAlign: "left" }}>
                        <span
                          style={{
                            color: "#1FBEAC",
                            fontSize: "20px",
                            fontWeight: "600",
                          }}
                        >
                          {daysCount[index]}
                        </span>
                      </td>
                    </tr>
                  </table>
                </div>
                <div
                  style={{
                    position: "absolute",
                    bottom: "10px",
                    right: "20px",
                  }}
                >
                  <Button
                    size="xs"
                    variant="outline"
                    color="red"
                    leftIcon={<TrashX />}
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteCourseId(course.id);
                      setDeleteCourseModalOpened(true);
                    }}
                  >
                    Удалить
                  </Button>
                </div>
              </Card>
            );
          })}
      </SimpleGrid>
      {coursesLoading && (
        <Center>
          <Loader color="orange" variant="bars" />
        </Center>
      )}
      {!coursesLoading && coursesList.length === 0 && (
        <Center>Список курсов пуст</Center>
      )}
      <Center>{coursesListError}</Center>
    </div>
  );
};