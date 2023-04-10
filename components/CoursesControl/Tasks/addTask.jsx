import { useState } from "react";

import {
  Modal,
  InputWrapper,
  Input,
  Group,
  Text,
  Space,
  Button,
  useMantineTheme,
  Center,
  LoadingOverlay,
  MultiSelect,
} from "@mantine/core";
import RichTextEditor from "/components/RichText";
import { nanoid } from "nanoid";
import { showNotification } from "@mantine/notifications";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { Upload, X, File, Check } from "tabler-icons-react";
import axios from "/utils/rest";

export const AddTask = ({ opened, setOpened, pushTask, courseId, dayId }) => {
  const [loading, setLoading] = useState(false);

  const [addError, setAddError] = useState("");

  const [nameError, setNameError] = useState("");

  const [description, setDescription] = useState("");
  const [files, setFiles] = useState("");

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

  const FileUploadIcon = ({ status, ...props }) => {
    if (status.accepted) {
      return <Upload {...props} />;
    }

    if (status.rejected) {
      return <X {...props} />;
    }

    return <File {...props} />;
  };

  const dropzoneChildren = (status, theme) => (
    <Group position="center" spacing="xl" style={{ minHeight: 220, pointerEvents: "none" }}>
      <FileUploadIcon status={status} style={{ color: getIconColor(status, theme) }} size={80} />
      <div>
        <Text size="xl" inline>
          Переместите файлы сюда
        </Text>
      </div>
    </Group>
  );

  const saveTask = (e) => {
    e.preventDefault();
    setNameError("");
    setAddError("");
    if (e.target.name.value === "") {
      setNameError("Введите название дня");
      return;
    }

    setLoading(true);

    const body = new FormData();
    body.append("name", e.target.name.value);
    body.append("description", description);
    if (files) {
      for (let index in files) {
        body.append(
          `file_${index}`,
          files[index],
          `task_${nanoid()}.${files[index].path.split(".")[files[index].path.split(".").length - 1]}`
        );
      }
    }
    axios
      .post(`/courses/${courseId}/days/${dayId}/tasks`, body)
      .then((res) => {
        if (res.status === 200) {
          pushTask(res.data);
          showNotification({
            title: "Задание добавлено",
            autoClose: 3500,
            color: "green",
            icon: <Check size={18} />,
          });
          e.target.reset();
        } else {
          setAddError("Ошибка добавления задания, попробуйте позже");
        }
      })
      .catch((error) => {
        console.log(error);
        if (error.response.status === 409) {
          setAddError("Задание уже существует");
        } else {
          setAddError("Ошибка добавления задания, попробуйте позже");
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Modal
      opened={opened}
      onClose={() => setOpened(false)}
      title="Добавить задание"
      size="lg"
      transition="fade"
      transitionDuration={300}
      transitionTimingFunction="ease"
    >
      <form onSubmit={saveTask}>
        <LoadingOverlay visible={loading} />
        <InputWrapper
          required
          label="Название задания"
          description="Название задания в свободной форме, будет отображаться в качесвте заголовка"
          error={nameError}
        >
          <Input type="text" name="name" />
        </InputWrapper>
        <Space h="md" />
        <Text>Описание</Text>
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
        <Space h="md" />
        <Text>Файл</Text>
        <Dropzone
          onDrop={(files) => {
            setFiles(files);
          }}
          onReject={() => {
            showNotification({
              title: "Файл отклонен",
              autoClose: 3500,
              color: "red",
              icon: <X size={18} />,
            });
          }}
          maxSize={3 * 4024 ** 2}
          padding="xs"
        >
          {(status) => dropzoneChildren(status, theme)}
        </Dropzone>
        <Space h="md" />
        <Center>
          <Button color="green" type="submit" style={{ marginRight: "20px" }}>
            Добавить
          </Button>
          <Button
            variant="light"
            color="dark"
            onClick={() => {
              setOpened(false);
            }}
          >
            Отменить
          </Button>
        </Center>
        <Center>
          <Text color="red">{addError}</Text>
        </Center>
      </form>
    </Modal>
  );
};
