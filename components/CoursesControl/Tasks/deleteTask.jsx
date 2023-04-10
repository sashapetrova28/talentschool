import { useState } from 'react';

import { Modal, Center, Button, LoadingOverlay, Text, Space } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { TrashX } from 'tabler-icons-react';
import axios from '/utils/rest';

export const DeleteTask = ({ opened, setOpened, removeTask, courseId, dayId, deleteTaskId }) => {
	const [loading, setLoading] = useState(false);

	const [deleteError, setDeleteError] = useState('');

	const deleteTask = () => {
		setLoading(true);
		setDeleteError('');
		if (deleteTaskId !== -1) {
			axios.delete(`/courses/${courseId}/days/${dayId}/tasks/${deleteTaskId}`)
				.then(res => {
					if (res.status === 200) {
						removeTask(res.data.id);
						setOpened(false);
						showNotification({
							title: 'Задание удалено',
							autoClose: 3500,
							color: 'red',
							icon: <TrashX size={18} />,
						});
					} else {
						setDeleteError('Ошибка удаления задания, попробуйте позже');
					}
				})
				.catch(error => {
					console.log(error)
					if (error.response.status === 410) {
						setDeleteError('Задание не найдено');
					} else {
						setDeleteError('Ошибка удаления задания, попробуйте позже');
					}
				})
				.finally(() => {
					setLoading(false);
				});
		}
	}

	return (
		<Modal
			opened={opened}
			onClose={() => setOpened(false)}
			title="Удалить задание?"
			transition="fade"
			transitionDuration={300}
			transitionTimingFunction="ease"
		>
			<LoadingOverlay visible={loading} />
			<Text>Это действие нельзя будет отменить. Будут удалены все связанные с заданием ответы пользователей</Text>
			<Space h="md" />
			<Center>
				<Button
					onClick={() => deleteTask(false)}
					color="red"
					style={{ marginRight: '20px' }}
				>
					Удалить
				</Button>
				<Button
					onClick={() => setOpened(false)}
					variant="light"
					color="dark"
				>
					Отменить
				</Button>
			</Center>
			<Space h="md" />
			<Center>
				<Text color="red">{deleteError}</Text>
			</Center>
		</Modal>
	)
}
