import { useState } from 'react';

import { Modal, Center, Button, LoadingOverlay, Text } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { TrashX } from 'tabler-icons-react';
import axios from '/utils/rest';

export const DeleteUser = ({ opened, setOpened, removeUser, deleteUserId }) => {
	const [loading, setLoading] = useState(false);

	const [deleteError, setDeleteError] = useState('');

	const deleteUser = () => {
		setLoading(true);
		setDeleteError('');
		if (deleteUserId !== -1) {
			axios.delete(`/user/${deleteUserId}`)
			.then(res => {
				if (res.status === 200) {
					removeUser(res.data.id);
					setOpened(false);
					showNotification({
						title: 'Пользователь удален',
						autoClose: 3500,
						color: 'red',
						icon: <TrashX size={18} />,
					});
				} else {
					setDeleteError('Ошибка удаления пользователя, попробуйте позже');
				}
			})
			.catch(error => {
				console.log(error)
				if (error.response.status === 410) {
					setDeleteError('Пользователь не найден');
				} else {
					setDeleteError('Ошибка удаления пользователя, попробуйте позже');
				}
			})
			.finally(() => {
				setLoading(false);
			});
		} else {
			setDeleteError('Ошибка удаления пользователя, попробуйте позже');
		}
	}

	return (
		<Modal
			opened={opened}
			onClose={() => setOpened(false)}
			title="Удалить пользователя?"
			transition="fade"
			transitionDuration={300}
			transitionTimingFunction="ease"
		>
			<LoadingOverlay visible={loading} />
			<Text>Это действие нельзя будет отменить</Text>
			<Center>
				<Button
					onClick={() => deleteUser(false)}
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
			<Center>
				<Text color="red">{deleteError}</Text>
			</Center>
		</Modal>
	)
}
