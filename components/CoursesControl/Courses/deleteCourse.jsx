import { useState } from 'react';

import { Modal, Center, Button, LoadingOverlay, Text, Space } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { TrashX } from 'tabler-icons-react';
import axios from '/utils/rest';

export const DeleteCourse = ({ opened, setOpened, removeCourse, deleteCourseId }) => {
	const [loading, setLoading] = useState(false);

	const [deleteError, setDeleteError] = useState('');

	const deleteCourse = () => {
		setLoading(true);
		setDeleteError('');
		if (deleteCourseId !== -1) {
			axios.delete(`/courses/${deleteCourseId}`)
				.then(res => {
					if (res.status === 200) {
						removeCourse(res.data.id);
						setOpened(false);
						showNotification({
							title: 'Курс удален',
							autoClose: 3500,
							color: 'red',
							icon: <TrashX size={18} />,
						});
					} else {
						setDeleteError('Ошибка удаления курса, попробуйте позже');
					}
				})
				.catch(error => {
					console.log(error)
					if (error.response.status === 410) {
						setDeleteError('Курс не найден');
					} else {
						setDeleteError('Ошибка удаления курса, попробуйте позже');
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
			title="Удалить курс?"
			transition="fade"
			transitionDuration={300}
			transitionTimingFunction="ease"
		>
			<LoadingOverlay visible={loading} />
			<Text>Это действие нельзя будет отменить. Будут удалены все связанные с курсом дни, задания и ответы пользователей</Text>
			<Space h="md" />
			<Center>
				<Button
					onClick={() => deleteCourse(false)}
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
