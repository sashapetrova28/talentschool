import {
	Card,
	Center,
	Group,
	Input,
	InputWrapper,
	LoadingOverlay,
	MultiSelect,
	Tabs,
	Text,
	useMantineTheme,
} from "@mantine/core";
import RichTextEditor from "/components/RichText";
import styles from "./coursesControl.module.scss";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { showNotification } from "@mantine/notifications";
import { nanoid } from "nanoid";
import Image from "next/image";
import { useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { Check, Error404, Photo, Upload, X } from "tabler-icons-react";
import { Days } from "../Days";
import axios from "/utils/rest";
import { useRouter } from "next/router";
import styless from './Course.module.scss';

export const EditCourse = ({
	opened,
	setOpened,
	updateCoursesList,
	editCourseId,
}) => {
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
	const router = useRouter();
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
				.finally(() => { });
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
	const onCancel = () => {
		router.push("/account");
		setOpened(false);
	};
	const onSelect = async (selected) => {
		const user = users.find(
			(user) => user.id === selected[selected.length - 1]
		);
		await axios
			.post(`/courses/${editCourseId}/users`, user)
			.then((result) => {
				setSelectedUsers([...result.data]);
			})
			.catch(console.log);
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
		<Group
			position="center"
			spacing="xl"
			style={{ minHeight: 220, pointerEvents: "none" }}
		>
			{image ? (
				<Image
					src={createObjectURL ? createObjectURL : "/" + image}
					width={125}
					height={125}
					alt="Изображение курса"
				/>
			) : (
				<ImageUploadIcon
					status={status}
					style={{ color: getIconColor(status, theme) }}
					size={80}
				/>
			)}
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
					updateCoursesList(res.data.course);
					showNotification({
						title: "Курс изменен",
						autoClose: 3500,
						color: "green",
						icon: <Check size={18} />,
					});
					onCancel()
				} else {
					setEditError("Ошибка изменения курса, попробуйте позже");
				}
			})
			.catch((error) => {
				console.log(error);
				if (error.status === 409) {
					setEditError("Такое название курса уже занято");
				} else {
					setEditError("Ошибка изменения курса, попробуйте позже");
				}
			})
			.finally(() => {
				setLoading(false);
			});
	};

	const onRemove = async (id) => {
		await axios
			.delete(`/courses/${editCourseId}/users`, { params: { user_id: id } })
			.then((res) => setSelectedUsers(res.data));
	};


	return (
		<div>
			{description.length > 0 && (
				<form className={styless.form} onSubmit={saveCourse}>
					<div className={styless.buttons} style={{ textAlign: "end" }}>
						<button
							style={{
								fontSize: "12px",
								color: "#036459",
								fontWeight: "600",
								marginRight: "9px",
								backgroundColor: "white",
								border: "2px solid #33CFBD",
								borderRadius: "20px",
								padding: "10px 14px",
							}}
							type="submit"
						>
							Сохранить
						</button>
						<button
							style={{
								fontSize: "12px",
								color: "#036459",
								fontWeight: "600",
								backgroundColor: "white",
								border: "2px solid #FD938E",
								borderRadius: "20px",
								padding: "10px 14px",
							}}
							onClick={onCancel}
						>
							Отменить
						</button>
					</div>
					<Row>
						<Col md={4}>
							<Card shadow="sm" padding="lg" radius="md" withBorder>
								<InputWrapper required label="Название курса" error={nameError}>
									<Input
										type="text"
										name="name"
										value={nameDefaultValue}
										onChange={(e) => setNameDefaultValue(e.currentTarget.value)}
									/>
								</InputWrapper>
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
							</Card>
						</Col>
						<Col md={8}>
							<Tabs unstyled color="#036459">
								<Tabs.Tab label="Участники">
									<MultiSelect
										style={{
											border: "2px solid #33CFBD",
											padding: "25px",
											borderRadius: "8px",
											boxShadow: "0px 2px 20px #BBBBBB",
										}}
										value={selectedUsers.map((user) => {
											return user.id;
										})}
										onChange={onSelect}
										data={users.map((user) => ({
											value: user.id,
											label: user.email,
										}))}
										valueComponent={({ className, label, value }) => {
											return (
												<div
													className={`${className} ${styles.userList}`}
													style={{ display: "flex", gap: "5px" }}
												>
													<span>{label}</span>
													<X size={18} onClick={() => onRemove(value)} />
												</div>
											);
										}}
										label="Добавьте пользователя"
										placeholder="Пользователи не выбраны"
										searchable
										nothingFound="Пользователи не найдены"
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