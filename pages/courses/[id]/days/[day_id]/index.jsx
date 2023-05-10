import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

import { sessionOptions } from "/lib/session";
import { withIronSessionSsr } from "iron-session/next";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import axios from "/utils/rest";
import Container from "react-bootstrap/Container";
import { ArrowBigRightLine } from "tabler-icons-react";

import {
  Text,
  Space,
  Card,
  RingProgress,
  Group,
  Center,
  Tabs,
  Button,
  useMantineTheme,
  Progress,
  Title,
} from "@mantine/core";

export default function Tasks({ course, day, tasks, tasks_ready }) {
  const theme = useMantineTheme();

  const secondaryColor = theme.colorScheme === "dark" ? theme.colors.dark[1] : theme.colors.gray[7];

  return (
    <>
      <Head>
        <title>Школа талантов</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container>
        <Space h="xl" />
        <div style={{ color: "#036459", fontSize: "24px", fontWeight: "600" }}>
          Курсы &gt;{" "}
          <span style={{ fontSize: "14px" }}>
            {course.name} &gt; {day.name}
          </span>
        </div>
        <Space h="xl" />
        <Row>
          <Col md={4}>
            <Card
                shadow="sm"
                padding="lg"
                radius="md"
                withBorder
                className="mb-4 p-5"
                style={{ height: "300px", border: "2px solid #F9B312", boxShadow: "0px 2px 20px #BBBBBB" }}
              >
              <div
                style={{
                  color: "#036459",
                  fontWeight: "600",
                  fontSize: "24px",
                }}
              >
                {day.name}
              </div>
            </Card>
            <Card
              shadow="sm"
              padding="lg"
              radius="md"
              withBorder
              style={{ border: "2px solid #33CFBD", boxShadow: "0px 2px 20px #BBBBBB" }}
            >
              <div className="d-flex justify-content-center">
                <RingProgress
                  label={<Text align="center">{Math.round((tasks_ready / tasks.length) * 100)}%</Text>}
                  sections={[{ value: (tasks_ready / tasks.length) * 100, color: "#1FBEAC" }]}
                />
              </div>
            </Card>
          </Col>
          <Col md={8}>
          <Tabs unstyled color="#036459">
              <Tabs.Tab label="Видео">
                <Card
                  shadow="sm"
                  padding="lg"
                  radius="md"
                  withBorder
                  style={{ border: "2px solid #33CFBD", boxShadow: "0px 2px 20px #BBBBBB" }}
                >
                  <div style={{ fontWeight: "600", fontSize: "20px", color: "#036459", margin: "30px 0" }}>
                    Посмотрите видео и выполните задания
                  </div>

                  <Center>
                    <iframe
                      width={700}
                      height={400}
                      src={day.video}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </Center>
                </Card>
              </Tabs.Tab>
              <Tabs.Tab label="Задания">
                {tasks.map((task) => {
                  return (
                    <Card
                      shadow="sm"
                      padding="lg"
                      radius="md"
                      withBorder
                      key={task.id}
                      style={{ marginBottom: "16px" }}
                    >
                      <Link passHref href={`/courses/${course.id}/days/${day.id}/tasks/${task.id}`}>
                        <div
                          className="d-flex align-items-center justify-content-between"
                          style={{ cursor: "pointer" }}
                        >
                          <div className="d-flex align-items-center">
                            <div>
                              <div style={{ color: "#1FBEAC", fontWeight: "600" }}>{task.name}</div>
                            </div>
                          </div>
                          <div>
                            <ArrowBigRightLine size={48} strokeWidth={2} color={"#036459"} />
                          </div>
                        </div>
                      </Link>
                    </Card>
                  );
                })}
              </Tabs.Tab>
            </Tabs>
          </Col>
        </Row>
        {/* <Card p="lg">
          <Text
            size="sm"
            weight={500}
            style={{ color: secondaryColor, lineHeight: 1.5 }}
            dangerouslySetInnerHTML={{ __html: day.description }}
          ></Text>
        </Card> */}
      </Container>
    </>
  );
}

export const getServerSideProps = withIronSessionSsr(async function getServerSideProps({ req, query }) {
  if (!req.cookies["user-cookies"]) {
    return {
      redirect: {
        destination: "/auth",
        permanent: false,
      },
    };
  }
  const { day_id } = query;
  const response = await axios.get(`/public/days/${day_id}`, {
    headers: {
      Cookie: `user-cookies=${req.cookies["user-cookies"]};`,
    },
  });
  let course = {};
  let day = {};
  let tasks = [];
  let tasks_ready = 0;
  if (response.status === 200) {
    course = response.data.course;
    day = response.data.day;
    tasks = response.data.tasks;
    tasks_ready = response.data.tasks_ready;
  }
  return {
    props: {
      course: course,
      day: day,
      tasks: tasks,
      tasks_ready: tasks_ready,
      user: req.session.user,
    },
  };
}, sessionOptions);
