import { useEffect, useState } from "react";

import {
  Modal,
  InputWrapper,
  Input,
  Group,
  Text,
  Space,
  Tabs,
  Card,
  Button,
  useMantineTheme,
  Center,
  LoadingOverlay,
  MultiSelect,
} from "@mantine/core";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import RichTextEditor from "/components/RichText";
import { nanoid } from "nanoid";
import { showNotification } from "@mantine/notifications";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { Upload, X, Photo, Check } from "tabler-icons-react";
import axios from "/utils/rest";

export const AddCourse = ({ opened, setOpened, pushCourse }) => {
  const [loading, setLoading] = useState(false);

  const [addError, setAddError] = useState("");

  const [nameError, setNameError] = useState("");

  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [createObjectURL, setCreateObjectURL] = useState(null);

  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const theme = useMantineTheme();

  const getIconColor = (status, theme) => {
    return status.accepted
      ? theme.colors[theme.primaryColor][theme.colorScheme === "dark" ? 4 : 6]
      : status.rejected
      ? theme.colors.red[theme.colorScheme === "dark" ? 4 : 6]
      : theme.colorScheme === "dark"
      ? theme.colors.dark[0]
      : theme.colors.gray[7];
  };

  useEffect(() => {
    if (opened) {
      axios
        .get("/users")
        .then((res) => {
          console.log(res);
          setUsers(res.data);
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {});
    }
  }, [opened]);

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
      {createObjectURL ? (
        <img src={createObjectURL} width={100} />
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
    setAddError("");
    if (e.target.name.value === "") {
      setNameError("Введите название курса");
      return;
    }

    if (image === "") {
      setAddError("Выберите изображение");
      return;
    }

    setLoading(true);

    const body = new FormData();
    body.append("name", e.target.name.value);
    body.append("description", description);
    body.append("selectedUsers", JSON.stringify(selectedUsers));
    body.append("image", image, `course_${nanoid()}`);
    axios
      .post("/courses", body)
      .then((res) => {
        if (res.status === 200) {
          pushCourse(res.data);
          showNotification({
            title: "Курс добавлен",
            autoClose: 3500,
            color: "green",
            icon: <Check size={18} />,
          });
          e.target.reset();
        } else {
          setAddError("Ошибка добавления курса, попробуйте позже");
        }
      })
      .catch((error) => {
        console.log(error);
        if (error.response.status === 409) {
          setAddError("Курс уже существует");
        } else {
          setAddError("Ошибка добавления курса, попробуйте позже");
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div>
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
            color="green"
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
        <Center>
          <Text color="red">{addError}</Text>
        </Center>
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
                <Input type="text" name="name" />
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
      </form>
    </div>
  );
};
