import { useEffect, useState } from "react";
import Image from "next/image";

import {
  Modal,
  InputWrapper,
  Input,
  Group,
  Text,
  Tabs,
  Card,
  Space,
  Button,
  useMantineTheme,
  Center,
  LoadingOverlay,
  MultiSelect,
} from "@mantine/core";
import RichTextEditor from "/components/RichText";
import { Days } from "../Days";
import { nanoid } from "nanoid";
import { showNotification } from "@mantine/notifications";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { Upload, X, Photo, Check, Error404 } from "tabler-icons-react";
import axios from "/utils/rest";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

export const EditCourse = ({ opened, setOpened, updateCoursesList, editCourseId }) => {
  const [loading, setLoading] = useState(false);

  const [editError, setEditError] = useState("");
  const [nameError, setNameError] = useState("");

  const [nameDefaultValue, setNameDefaultValue] = useState("");

  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [createObjectURL, setCreateObjectURL] = useState(null);

  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const theme = useMantineTheme();

  useEffect(() => {
    if (opened) {
      axios
        .get("/users")
        .then((res) => {
          setUsers(res.data);
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {});
    }
  }, [opened]);

  useEffect(() => {
    if (editCourseId !== -1) {
      setDescription("");
      setSelectedUsers([]);
      setLoading(true);
      axios
        .get(`/courses/${editCourseId}`)
        .then((res) => {
          if (res.status === 200) {
            setNameDefaultValue(res.data.name);
            console.log("description set");
            setDescription(res.data.description);
            setImage(res.data.image);
            axios
              .get(`/courses/${editCourseId}/users`)
              .then((res) => {
                if (res.status === 200) {
                  setSelectedUsers(res.data);
                } else {
                  setEditError("Ошибка редактирования курса, попробуйте позже");
                }
              })
              .catch((error) => {
                console.log(error);
                if (error.response.status === 410) {
                  setEditError("Курс не найден, попробуйте позже");
                }
              })
              .finally(() => {
                setLoading(false);
              });
          } else {
            setEditError("Ошибка редактирования курса, попробуйте позже");
          }
        })
        .catch((error) => {
          console.log(error);
          if (error.response.status === "404") {
            showNotification({
              title: "Курс не найден",
              autoClose: 3500,
              color: "red",
              icon: <Error404 size={18} />,
            });
          } else {
            showNotification({
              title: "Ошибка получения курса",
              autoClose: 3500,
              color: "red",
              icon: <Error404 size={18} />,
            });
          }
          setOpened(false);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [editCourseId, setOpened, setSelectedUsers]);

  const getIconColor = (status, theme) => {
    return status.accepted
      ? theme.colors[theme.primaryColor][theme.colorScheme === "dark" ? 4 : 6]
      : status.rejected
      ? theme.colors.red[theme.colorScheme === "dark" ? 4 : 6]
      : theme.colorScheme === "dark"
      ? theme.colors.dark[0]
      : theme.colors.gray[7];
  };

  const ImageUploadIcon = ({ status, ...props }) => {
    if (status.accepted) {
      return <Upload {...props} />;
    }

    if (status.rejected) {
      return <X {...props} />;
    }

    return <Photo {...props} />;
  };

  const dropzoneChildren = (status, theme) => (
    <Group position="center" spacing="xl" style={{ minHeight: 220, pointerEvents: "none" }}>
      {image ? (
        <Image src={createObjectURL ? createObjectURL : "/" + image} width={125} height={125} alt="Изображение курса" />
      ) : (
        <ImageUploadIcon status={status} style={{ color: getIconColor(status, theme) }} size={80} />
      )}
      <div>
        <Text size="xl" inline>
          Переместите фото сюда
        </Text>
      </div>
    </Group>
  );

  const saveCourse = (e) => {
    e.preventDefault();
    setNameError("");
    setEditError("");
    if (e.target.name.value === "") {
      setNameError("Введите название курса");
      return;
    }

    if (image === "") {
      setEditError("Выберите изображение");
      return;
    }

    setLoading(true);

    const body = new FormData();
    body.append("name", e.target.name.value);
    body.append("description", description);
    if (image && image.path) {
      body.append("image", image, `course_${nanoid()}`);
    }
    axios
      .put(`/courses/${editCourseId}`, body)
      .then((res) => {
        if (res.status === 200) {
          console.log(updateCoursesList);
          updateCoursesList(res.data.course);
          showNotification({
            title: "Курс изменен",
            autoClose: 3500,
            color: "green",
            icon: <Check size={18} />,
          });
        } else {
          setEditError("Ошибка изменения курса, попробуйте позже");
        }
      })
      .catch((error) => {
        console.log(error);
        if (error.response.status === 409) {
          setEditError("Такое название курса уже занято");
        } else {
          setEditError("Ошибка изменения курса, попробуйте позже");
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div>
      {description.length > 0 && (
        <form onSubmit={saveCourse}>
          <div style={{ textAlign: "end" }}>
            <button
              style={{
                fontSize: "16px",
                color: "#1FBEAC",
                fontWeight: "600",
                marginRight: "35px",
                border: "none",
                backgroundColor: "white",
              }}
              type="submit"
            >
              Сохранить
            </button>
            <button
              style={{
                fontSize: "16px",
                color: "#1FBEAC",
                fontWeight: "600",
                border: "none",
                backgroundColor: "white",
              }}
              onClick={() => setOpened(false)}
            >
              Отменить
            </button>
          </div>
          <Row>
            <Col md={4}>
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Dropzone
                  onDrop={(files) => {
                    setImage(files[0]);
                    setCreateObjectURL(URL.createObjectURL(files[0]));
                  }}
                  onReject={() => {
                    showNotification({
                      title: "Файл отклонен",
                      autoClose: 3500,
                      color: "red",
                      icon: <X size={18} />,
                    });
                  }}
                  maxSize={3 * 1024 ** 2}
                  accept={IMAGE_MIME_TYPE}
                  padding="xs"
                >
                  {(status) => dropzoneChildren(status, theme)}
                </Dropzone>
                <InputWrapper required label="Название курса" error={nameError}>
                  <Input
                    type="text"
                    name="name"
                    value={nameDefaultValue}
                    onChange={(e) => setNameDefaultValue(e.currentTarget.value)}
                  />
                </InputWrapper>
              </Card>
            </Col>
            <Col md={8}>
              <Tabs unstyled color="#036459">
                <Tabs.Tab label="Участники">
                  <MultiSelect
                    value={selectedUsers}
                    onChange={(selected) => setSelectedUsers(selected)}
                    data={users.map((el) => el.email)}
                    label="Выберите пользователей, которые должны попасть на курс"
                    placeholder="Пользователей не выбрано"
                    searchable
                    nothingFound="Пользователей не найдено"
                  />
                </Tabs.Tab>
                <Tabs.Tab label="О курсе">
                  <RichTextEditor
                    name="description"
                    value={description}
                    onChange={(value) => {
                      setDescription(value);
                    }}
                    controls={[
                      ["bold", "italic", "underline", "link"],
                      ["unorderedList", "orderedList"],
                      ["h1", "h2", "h3"],
                      ["sup", "sub"],
                      ["alignLeft", "alignCenter", "alignRight"],
                    ]}
                    style={{ height: "400px", overflow: "auto" }}
                  />
                </Tabs.Tab>
              </Tabs>
            </Col>
          </Row>
          <LoadingOverlay visible={loading} />
          <Center>
            <Text color="red">{editError}</Text>
          </Center>
        </form>
      )}
      <Days opened={editCourseId} courseId={editCourseId} />
    </div>
  );
};
