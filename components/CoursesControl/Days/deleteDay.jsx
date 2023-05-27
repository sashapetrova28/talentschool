import { useState } from 'react';

import { Modal, Center, Button, LoadingOverlay, Text, Space } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { TrashX } from 'tabler-icons-react';
import axios from '/utils/rest';

export const DeleteDay = ({ opened, setOpened, removeDay, courseId, deleteDayId }) => {
	const [loading, setLoading] = useState(false);

	const [deleteError, setDeleteError] = useState('');

	const deleteDay = () => {
		setLoading(true);
		setDeleteError('');
		if (deleteDayId !== -1) {
			axios.delete(`/courses/${courseId}/days/${deleteDayId}`)
				.then(res => {
					if (res.status === 200) {
						removeDay(res.data.id);
						setOpened(false);
						showNotification({
							title: 'День удален',
							autoClose: 3500,
							color: 'red',
							icon: <TrashX size={18} />,
						});
					} else {
						setDeleteError('Ошибка удаления дня, попробуйте позже');
					}
				})
				.catch(error => {
					console.log(error)
					if (error.response.status === 410) {
						setDeleteError('День не найден');
					} else {
						setDeleteError('Ошибка удаления дня, попробуйте позже');
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
			title="Удалить день?"
			transition="fade"
			transitionDuration={300}
			transitionTimingFunction="ease"
		>
			<LoadingOverlay visible={loading} />
			<Text>Это действие нельзя будет отменить. Будут удалены все связанные с днем задания и ответы пользователей</Text>
			<Space h="md" />
			<Center>
				<button
					onClick={() => deleteDay(false)}
					className="redButton"
					color="red"
					style={{ marginRight: '20px' }}
				>
					Удалить
				</button>
				<button
					className="greyButton"
					onClick={() => setOpened(false)}
					variant="light"
					color="dark"
				>
					Отменить
				</button>
			</Center>
			<Space h="md" />
			<Center>
				<Text color="red">{deleteError}</Text>
			</Center>
		</Modal>
	)
}
