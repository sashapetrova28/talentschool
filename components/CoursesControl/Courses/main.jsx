import { useState, useEffect } from "react";
import axios from "/utils/rest";

import { Space, Loader, Card, SimpleGrid, Button, Center, Image, Table, Stack } from "@mantine/core";
import { Plus, TrashX, Edit, ListNumbers, List, Car } from "tabler-icons-react";

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
  return (
    <div>
      <Space h="xl" />
      {/* <thead>
          <tr>
            <th>Название</th>
            <th>Количество дней</th>
            <th>Количество участников</th>
            <th>Действия</th>
          </tr>
        </thead> */}
      {/* <tbody> */}
      <SimpleGrid cols={3}>
        {!coursesLoading &&
          coursesList.map((course) => {
            return (
              <Card
                onClick={() => {
                  setEditCourseId(course.id);
                  setEditCourseModalOpened(true);
                }}
                key={course.id}
                shadow="sm"
                padding="lg"
                radius="md"
                withBorder
                style={{ cursor: "pointer", position: "relative", paddingBottom: "45px" }}
              >
                <div style={{ fontSize: "16px", fontWeight: "600", color: "#036459", marginBottom: "24px" }}>
                  {course.name}
                </div>
                <div className="d-flex align-items-center">
                  <div style={{ paddingRight: "20px" }}>
                    {course.image && (
                      <Image radius={100} src={"/" + course.image} width={100} height={100} alt="Инкубатор талантов" />
                    )}
                  </div>
                  <table style={{ width: "50%" }}>
                    <tr>
                      <td style={{ fontSize: "16px", color: "#036459", fontWeight: "600" }}>участников</td>
                      <td style={{ textAlign: "left" }}>
                        <span style={{ color: "#1FBEAC", fontSize: "18px" }}>{course.selected_users}</span>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ fontSize: "16px", color: "#036459", fontWeight: "600" }}>дней</td>
                      <td style={{ textAlign: "left" }}>
                        <span style={{ color: "#1FBEAC", fontSize: "18px" }}>{course.days}</span>
                      </td>
                    </tr>
                  </table>
                </div>
                <div style={{ position: "absolute", bottom: "10px", right: "20px" }}>
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
      {!coursesLoading && coursesList.length === 0 && <Center>Список курсов пуст</Center>}
      <Center>{coursesListError}</Center>
    </div>
  );
};
