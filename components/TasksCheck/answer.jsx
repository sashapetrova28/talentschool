import { useEffect, useState } from "react";

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
  NativeSelect,
  Grid,
  Flex,
} from "@mantine/core";
import { nanoid } from "nanoid";
import { showNotification } from "@mantine/notifications";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { Upload, X, File, Check, Send } from "tabler-icons-react";
import axios from "/utils/rest";
import styles from "./messages.module.scss";

export const Answer = ({ opened, setOpened, task }) => {
  const theme = useMantineTheme();

  const [chatLoading, setChatLoading] = useState(false);
  const [chat, setChat] = useState([]);

  const [taskStatus, setTaskStatus] = useState("check");

  const [files, setFiles] = useState([]);

  useEffect(() => {
    if (task.task) {
      axios
        .get(`/to_check/${task.task.id}/${task.user.id}/chat`)
        .then((res) => {
          if (res.status === 200) {
            setChat(res.data);
            setTaskStatus(task.task.status);
          } else {
            setChatError("Ошибка получения чата, пожалуйста, попробуйте позже");
          }
        })
        .catch((error) => {
          console.log(error);
          setChatError("Ошибка получения чата, пожалуйста, попробуйте позже");
        })
        .finally(() => {
          setChatLoading(false);
        });
    }
  }, [task]);

  const sendMessage = (status) => {
    const body = new FormData();
    body.append("message", status ? "Принято" : "Не принято");
    body.append("user_id", task.user.id.toString());
    body.append("status", !status ? "waiting" : "ready");
    setTaskStatus("Доработать" ? "waiting" : "ready");
    if (files) {
      for (let index in files) {
        console.log(files[index].path);
        body.append(
          `file_${index}`,
          files[index],
          `task_${nanoid()}.${files[index].path.split(".")[files[index].path.split(".").length - 1]}`
        );
      }
    }
    axios
      .post(`/to_check/${task.task.id}/answer`, body)
      .then((res) => {
        e.target.reset();
        showNotification({
          title: "Сообщение отправлено",
          message: "Скоро эксперты проверят выполнение задания и дадут вам ответ",
          autoClose: 3500,
          color: "green",
          icon: <Check size={18} />,
        });
        setFiles([]);
        setChat([...chat, res.data]);
        setOpened(false);
      })
      .catch((error) => {})
      .finally(() => {
        setOpened(false);
      });
  };
  return (
    <Modal
      opened={opened}
      onClose={() => setOpened(false)}
      title={`Ответ на задание ${task.task && task.task.name}`}
      size="xl"
      transition="fade"
      transitionDuration={300}
      transitionTimingFunction="ease"
    >
      {!chatLoading && (
        <>
          <Text>{task.day && task.day.name}</Text>
          <Text color="blue">
            Статус задания:{" "}
            {taskStatus === "check" ? "Ожидает проверки" : taskStatus === "waiting" ? "На доработке" : "Готово"}
          </Text>
          <Text color="orange" weight={500} size="lg">
            {task.user && `${task.user.name} ${task.user.surname}`}
          </Text>
          <Space h="md" />
        </>
      )}
      {!chatLoading && (
        <>
          <div className={styles.messages}>
            {chat.map((message) => {
              return (
                <div
                  className={`${styles.message} ${message.answer_id ? styles.you : styles.interlocutor}`}
                  key={message.id}
                >
                  <Text size="md" weight={500}>
                    {message.message}
                  </Text>
                  {message.files.map((file, index) => {
                    return (
                      <Text key={file} variant="link" component="a" size="sm" href={`/${file}`}>
                        Скачать файл {index + 1}
                      </Text>
                    );
                  })}
                </div>
              );
            })}
          </div>
          <Center className="mt-2">
            <Button compact className="me-2" onClick={() => sendMessage(true)} id="send-message">
              Принять
            </Button>
            <Button color="red" compact onClick={() => sendMessage(false)} id="send-message">
              Не принять
            </Button>
          </Center>
        </>
      )}
    </Modal>
  );
};
