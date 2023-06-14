import { withIronSessionSsr } from "iron-session/next";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { sessionOptions } from "/lib/session";
import axios from "/utils/rest";

import {
	Card,
	Group,
	Image,
	RingProgress,
	SimpleGrid,
	Space,
	Tabs,
	Text,
	useMantineTheme,
} from "@mantine/core";
import { NextLink } from "@mantine/next";

export default function Days({ course, days, tasks, tasks_ready }) {
	const theme = useMantineTheme();
	const [activeTab, setActiveTab] = useState("first");
	const secondaryColor =
		theme.colorScheme === "dark" ? theme.colors.dark[1] : theme.colors.gray[7];

	return (
		<>
			<Head>
				<title>{course.name}</title>
				<meta name="description" content="Generated by create next app" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<Container>
				<Space h="xl" />
				<div style={{ color: "#036459", fontSize: "24px", fontWeight: "600" }}>
					<NextLink
						style={{ textDecoration: "none", color: "#036459" }}
						href={"/"}
					>
						Мои курсы
					</NextLink>{" "}
					&gt;{" "}
					<span style={{ fontSize: "14px", color: "#448459" }}>
						{course.name}
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
							style={{
								textAlign: "center",
								paddingBottom: "40px",
								marginBottom: "40px",
								border: "2px solid #1FBEAC",
								boxShadow: "0px 2px 20px #BBBBBB",
							}}
						>
							<div
								style={{
									margin: "0 auto",
									width: "145px",
									marginBottom: "20px",
								}}
							>
								{course.image && (
									<Image
										radius={100}
										src={"/" + course.image}
										width={145}
										height={145}
										alt="Школа талантов"
									/>
								)}
							</div>
							<div
								style={{
									fontSize: "15px",
									fontWeight: "600",
									color: "#036459",
								}}
							>
								{course.name}
							</div>
						</Card>
						<div
							style={{
								fontSize: "20px",
								fontWeight: "600",
								color: "#036459",
								marginBottom: "16px",
							}}
						>
							Прогресс
						</div>
						<Card
							shadow="sm"
							padding="lg"
							radius="md"
							withBorder
							style={{
								textAlign: "center",
								paddingBottom: "40px",
								border: "2px solid #1FBEAC",
								boxShadow: "0px 2px 20px #BBBBBB",
							}}
						>
							<div className="d-flex align-items-center justify-content-center">
								<RingProgress
									label={
										<Text align="center">
											{Math.round((tasks_ready / tasks) * 100)}%
										</Text>
									}
									sections={[
										{ value: (tasks_ready / tasks) * 100, color: "#1FBEAC" },
									]}
								/>
								<div style={{ paddingLeft: "20px", fontWeight: "600" }}>
									<div
										style={{
											fontSize: "16px",
											color: "#036459",
											paddingLeft: "10px",
										}}
									>
										<span style={{ color: "#1FBEAC" }}>{tasks_ready}</span>{" "}
										выполнено
									</div>
									<div
										style={{
											fontSize: "16px",
											color: "#036459",
											paddingLeft: "10px",
										}}
									>
										<span style={{ color: "#1FBEAC" }}>
											{tasks - tasks_ready}
										</span>{" "}
										осталось
									</div>
								</div>
							</div>
						</Card>
					</Col>
					<Col md={8}>
						<Tabs unstyled color="#036459">
							<Tabs.Tab label="Материалы курса">
								<SimpleGrid cols={3}>
									{days.map((day, index) => {
										if (!days[index - 1] || days[index - 1].show_day) {
											return (
												<Link
													key={
														Math.random() +
														new Date().getMilliseconds() * Math.random()
													}
													passHref
													href={`/courses/${course.id}/days/${day.id}`}
												>
													<Card
														p="lg"
														shadow="sm"
														padding="lg"
														radius="md"
														withBorder
														style={{
															cursor: "pointer",
															border: "2px solid #F9B312",
															boxShadow: "0px 2px 20px #BBBBBB",
														}}
													>
														<div style={{ height: "165px" }}>
															<Card.Section>
																{day.image && (
																	<Image
																		src={"/" + day.image}
																		width={36}
																		height={36}
																		alt="Школа талантов"
																	/>
																)}
															</Card.Section>
															<Group
																position="apart"
																style={{
																	marginBottom: 5,
																	marginTop: theme.spacing.sm,
																}}
															>
																<Text size="lg" weight={600} color="#036459">
																	{day.name}
																</Text>
															</Group>
														</div>
													</Card>
												</Link>
											);
										} else {
											return <div key={day.id}></div>;
										}
									})}
								</SimpleGrid>
							</Tabs.Tab>
							<Tabs.Tab label="О курсе">
								<Card
									shadow="sm"
									padding="lg"
									radius="md"
									withBorder
									style={{
										border: "2px solid #1FBEAC",
										boxShadow: "0px 2px 20px #BBBBBB",
									}}
								>
									<Text
										size="sm"
										weight={500}
										style={{ color: secondaryColor, lineHeight: 1.5 }}
										dangerouslySetInnerHTML={{ __html: course.description }}
									></Text>
								</Card>
							</Tabs.Tab>
						</Tabs>
					</Col>
				</Row>
			</Container>
		</>
	);
}

export const getServerSideProps = withIronSessionSsr(
	async function getServerSideProps({ req, res, query }) {
		if (!req.cookies["user-cookies"]) {
			return {
				redirect: {
					destination: "/auth",
					permanent: false,
				},
			};
		}
		const { id } = query;
		const response = await axios.get(`/public/courses/${id}`, {
			headers: {
				Cookie: `user-cookies=${req.cookies["user-cookies"]};`,
			},
		});
		let course = {};
		let days = [];
		let tasks = 0;
		let tasks_ready = 0;
		if (response.status === 200) {
			course = response.data.course;
			days = response.data.days;
			tasks = response.data.tasks;
			tasks_ready = response.data.tasks_ready;
		}
		return {
			props: {
				course: course,
				days: days,
				tasks: tasks,
				tasks_ready: tasks_ready,
				user: req.session.user,
			},
		};
	},
	sessionOptions
);