import { useEffect, useState } from 'react';

import { Modal, InputWrapper, Input, Group, Text, Space, Button, useMantineTheme, Center, NativeSelect, Grid, Select} from '@mantine/core';
import { nanoid } from 'nanoid';
import { RadioGroup, Radio } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { Upload, X, File, Check, Send } from 'tabler-icons-react';
import axios from '/utils/rest';
import styles from './messages.module.scss';

export const Answer = ({ opened, setOpened, task }) => {

	const theme = useMantineTheme();

	const [chatLoading, setChatLoading] = useState(false);
	const [chat, setChat] = useState([]);

	const [taskStatus, setTaskStatus] = useState('check');

	const [files, setFiles] = useState([]);

	useEffect(() => {
		if (task.task) {
			axios.get(`/to_check/${task.task.id}/${task.user.id}/chat`)
				.then(res => {
					if (res.status === 200) {
						setChat(res.data);
						setTaskStatus(task.task.status);
					} else {
						setChatError('Ошибка получения чата, пожалуйста, попробуйте позже');
					}
				})
				.catch(error => {
					console.log(error);
					setChatError('Ошибка получения чата, пожалуйста, попробуйте позже');
				})
				.finally(() => {
					setChatLoading(false);
				})
		}
	}, [task]);

	const getIconColor = (status, theme) => {
		return status.accepted
			? theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 4 : 6]
			: status.rejected
				? theme.colors.red[theme.colorScheme === 'dark' ? 4 : 6]
				: theme.colorScheme === 'dark'
					? theme.colors.dark[0]
					: theme.colors.gray[7];
	}

	const FileUploadIcon = ({
		status,
		...props
	}) => {
		if (status.accepted) {
			return <Upload {...props} />;
		}

		if (status.rejected) {
			return <X {...props} />;
		}

		return <File {...props} />;
	}

	const sendMessage = (e) => {
		e.preventDefault();
		const body = new FormData();
		body.append('message', e.target.message.value);
		body.append('user_id', task.user.id.toString());
		body.append('status', e.target.status.value === 'Принято' ? 'ready' : 'waiting');
		setTaskStatus('Принято' ? 'ready' : 'waiting');
		if (files) {
			for (let index in files) {
				console.log(files[index].path);
				body.append(`file_${index}`, files[index], `task_${nanoid()}.${files[index].path.split('.')[files[index].path.split('.').length - 1]}`);
			}
		}
		axios.post(`/to_check/${task.task.id}/answer`, body)
			.then(res => {
				e.target.reset();
				showNotification({
					title: 'Сообщение отправлено',
					// message: 'Скоро эксперты проверят выполнение задания и дадут вам ответ',
					autoClose: 3500,
					color: 'green',
					icon: <Check size={18} />,
				});
				setFiles([]);
				setChat([...chat, res.data]);
			})
			.catch(error => {

			})
			.finally(() => {

			})
	}
	return (
		<Modal
			opened={opened}
			onClose={() => setOpened(false)}
			title={task.day && task.day.name}
			size="xl"
			transition="fade"
			transitionDuration={300}
			transitionTimingFunction="ease"
		>
			{!chatLoading && <>
				<Text>
					{`Ответ на задание: ${task.task && task.task.name}`}
				</Text>
				{/* <Text color="blue">
					Статус задания: {taskStatus === 'check' ? 'Ожидает проверки' : taskStatus === 'waiting' ? 'На доработке' : 'Готово'}
				</Text> */}
				<Text weight={500} size="lg">
					Общение с учеником {task.user && `${task.user.name} ${task.user.surname}`}
				</Text>
				<Space h="md" />
			</>}
			{!chatLoading && <>
				<div className={styles.messages}>
					{chat.map(message => {
						return <div className={`${styles.message} ${(message.answer_id ? styles.you : styles.interlocutor)}`} key={message.id}>
							<Text size="sm">{message.answer_id ? 'Вы' : `Ученик ${task.user.name} ${task.user.surname}`}:</Text>
							<Text size="md" weight={500}>{message.message}</Text>
							{message.files.map((file, index) => {
								return <>
									<Text key={file} variant="link" component="a" size="sm" href={`/${file}`}>
										Скачать файл {index + 1}
									</Text>
									<Space h="sm" />
								</>
							})}
						</div>
					})}
				</div>
				<div>
					<form onSubmit={(e) => sendMessage(e)} >
						<div className={styles.input}>
							<input type="text" placeholder="Введите ваше сообщение" name="message" />
							<Send onClick={() => { document.getElementById('send-message').click() }} />
							<button type="submit" id="send-message"></button>
						</div>
						<Space h="md" />
						<Select
							data={['Принято', 'Доработать']}
							label="Выберите статус задания"
							placeholder="Не выбрано"
							required
							name="status"
						/>
						<Space h="md" />
						{files.length > 0 && <>
							<Text size="sm">Прикрепленные файлы: {files.map(el => {
								return ` ${el.name},`
							})}</Text>
						</>}
					</form>
				</div>
			</>}
		</Modal>
	)
}


{/* <Center className="mt-2">
							<button className={styles.button} 
							onClick={() => sendMessage(true)} id="send-message">
							Принять
							</button>
							<div style={{margin:"10px"}}></div>
							<button className={styles.button}
							onClick={() => sendMessage(false)} id="send-message">
							Не принять
							</button>
</Center> */}