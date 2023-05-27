import {
  Modal,
  Input,
  Button,
  Center,
  InputWrapper,
  Box,
  Text,
  Group,
  useMantineTheme,
} from "@mantine/core";
import { Dropzone } from "@mantine/dropzone";
import { RichTextEditor } from "@mantine/rte";
import { useEffect, useState } from "react";
import { File, Upload, X } from "tabler-icons-react";
const EditTask = ({
  opened = false,
  setOpened,
  courseId,
  dayId,
  updateTask,
  task,
}) => {
  const [value, setValue] = useState(task?.description?.toString());
  const [name, setName] = useState(task?.name?.toString());
  const [files, setFiles] = useState(task?.files || []);

  const resetHandle = () => {
    setOpened(false);
    setName(task?.name);
    setValue(task?.description);
    setFiles(task.files[0]);
  };
  useEffect(() => {
    setValue(task?.description);
    setName(task?.name);
    setFiles(task?.files);
  }, [task]);

  const sumbitHandle = (e) => {
    e.preventDefault();
    updateTask({ ...task, name, files, description: value });
  };
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
    <Group
      position="center"
      spacing="xl"
      style={{ minHeight: 220, pointerEvents: "none" }}
    >
      <FileUploadIcon
        status={status}
        style={{ color: getIconColor(status, theme) }}
        size={80}
      />
      <div>
        <Text size="xl" inline>
          Переместите файлы сюда
        </Text>
      </div>
    </Group>
  );
  const theme = useMantineTheme();
  return (
    <Modal
      opened={opened}
      onClose={() => setOpened(false)}
      title="Редактировать задание"
      transition="fade"
      transitionDuration={300}
      transitionTimingFunction="ease"
    >
      <form onSubmit={sumbitHandle}>
        {task?.fiels?.length > 0 && (
          <img src={createImageBitmap(task.files[0])} alt={task?.name} />
        )}
        <Box>
          <InputWrapper size="sm">
            <Input
              value={name}
              defaultValue={name}
              onChange={(e) => setName(e.target.value)}
            />
          </InputWrapper>
          <RichTextEditor
            defaultValue={value}
            value={value}
            onChange={setValue}
          />{" "}
          <Text>Файл: {JSON.stringify(files)}</Text>
          <Dropzone
            onDrop={(files) => {
              setFiles(files[0]);
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
            {(status) => dropzoneChildren(Boolean(status), theme)}
          </Dropzone>
        </Box>
        <Center>
          <button className="greenButton" style={{margin: "20px"}} color="cyan" type="submit" mt="sm">
            Сохранить
          </button>
          <button className="redButton" color="gray" mt="sm" ml="sm" onClick={resetHandle}>
            Отмена
          </button>
        </Center>
      </form>
    </Modal>
  );
};

export default EditTask;