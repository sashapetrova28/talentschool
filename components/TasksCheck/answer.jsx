import { useEffect, useState } from "react";

import { Center, Modal, Space, Text } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { nanoid } from "nanoid";
import { Check } from "tabler-icons-react";
import styles from "./messages.module.scss";
import axios from "/utils/rest";

export const Answer = ({ opened, setOpened, task }) => {
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

  const sendMessage = (e) => {
    e.preventDefault();
    const denyText = "Не принять";
    const denyButton = e.nativeEvent.submitter;
    const body = new FormData();
    body.append("message", e.target.message.value);
    body.append("user_id", task.user.id.toString());
    body.append(
      "status",
      e?.target.value === "Доработать" ? "waiting" : "ready"
    );
    body.append("status", denyButton.innerText == denyText ? "waiting" : "ready");
    setTaskStatus(e?.target.value === "Доработать" ? "waiting" : "ready");
    setTaskStatus(e?.target.value === "Доработать" ? "waiting" : "ready");
    if (files) {
      for (let index in files) {
        body.append(
          `file_${index}`,
          files[index],
          `task_${nanoid()}.${
            files[index].path.split(".")[
              files[index].path.split(".").length - 1
            ]
          }`
        );
      }
    }
    axios
      .post(`/to_check/${task.task.id}/answer`, body)
      .then(() => {
        e.target.reset();
        showNotification({
          title: "Сообщение отправлено",
          message:
            "Скоро эксперты проверят выполнение задания и дадут вам ответ",
          autoClose: 3500,
          color: "green",
          icon: <Check size={18} />,
        });
        setFiles([]);
        setOpened(false);
      })
      .catch(console.log);
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
            {taskStatus === "check"
              ? "Ожидает проверки"
              : taskStatus === "waiting"
              ? "На доработке"
              : "Готово"}
          </Text>
          <Text color="orange" weight={500} size="lg">
            Общение с талантом{" "}
            {task.user && `${task.user.name} ${task.user.surname}`}
          </Text>
          <Space h="md" />
        </>
      )}
      {!chatLoading && (
        <>
          <div className={styles.messages}>
            {chat
              .sort((prev, next) => Number(prev.id) - Number(next.id))
              .map((message) => {
                return (
                  <div
                    className={`${styles.message} ${
                      message.answer_id ? styles.you : styles.interlocutor
                    }`}
                    key={message.id}
                  >
                    <Text size="sm">
                      {message.answer_id
                        ? "Вы"
                        : `Талант ${task.user.name} ${task.user.surname}`}
                      :
                    </Text>
                    <Text size="md" weight={500}></Text>
                    {!message.answer_id ? (
                      <>
                        {message.message}

                        <a
                          key={message.id}
                          download
                          href={`${window?.location?.origin}/${message?.files[0]}`}
                        >
                          Скачать файл {" "}
                        </a>
                      </>
                    ) : (
                      <p>{message.answer_id && message.message}</p>
                    )}
                  </div>
                );
              })}
          </div>
          <div>
            <form onSubmit={sendMessage}>
              <div className={styles.input}>
                <input
                  type="text"
                  placeholder="Введите ваше сообщение"
                  name="message"
                />
              </div>
              <Space h="md" />
              <Center className="mt-2">
                <button
                  className={styles.button}
                  type="submit"
                  id="send-message"
                >
                  Принять
                </button>
                <div style={{ margin: "10px" }}></div>
                <button
                  className={styles.button}
                  type="submit"
                  id="send-message"
                >
                  Не принять
                </button>
              </Center>
              <Space h="md" />
              {files.length > 0 && (
                <>
                  <Text size="sm">
                    Прикрепленные файлы:{" "}
                    {files.map((el) => {
                      return ` ${el.name},`;
                    })}
                  </Text>
                </>
              )}
            </form>
          </div>
        </>
      )}
    </Modal>
  );
};