import { useState } from 'react';

import { Modal, InputWrapper, Input, Center, NativeSelect, Space, Button, LoadingOverlay, Text } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { Check } from 'tabler-icons-react';
import axios from '/utils/rest';

export const AddUser = ({ opened, setOpened, pushUser }) => {
	const [loading, setLoading] = useState(false);

	const [addError, setAddError] = useState('');

	const [emailError, setEmailError] = useState('');
	const [nameError, setNameError] = useState('');
	const [ageError, setAgeError] = useState('');
	const [surnameError, setSurnameError] = useState('');
	const [passwordError, setPasswordError] = useState('');
	const [password_rError, setPassword_rError] = useState('');

	const saveUser = (e) => {
		e.preventDefault();
		setAddError('');
		setEmailError('');
		setNameError('');
		setSurnameError('');
		setAgeError('');
		setPasswordError('');
		setPassword_rError('');
		if (e.target.email.value === '') {
			setEmailError('Введите электронную почту');
			return;
		}

		if (e.target.name.value === '') {
			setNameError('Введите имя пользователя');
			return;
		}

		if (e.target.surname.value === '') {
			setSurnameError('Введите фамилию пользователя');
			return;
		}

		if (e.target.age.value <= 0) {
			setAgeError('Введите возраст пользователя');
			return;
		}

		if (e.target.password.value === '') {
			setPasswordError('Введите пароль пользователя');
			return;
		}

		if (e.target.password_r.value !== e.target.password.value) {
			setPassword_rError('Пароли не совпадают');
			return;
		}
		setLoading(true);

		axios.post('/users', {
			email: e.target.email.value,
			name: e.target.name.value,
			surname: e.target.surname.value,
			password: e.target.password.value,
			age: e.target.age.value,
			status: e.target.status.value === 'Ученик' ? 'user' : 'admin'
		})
			.then(res => {
				if (res.status === 200) {
					pushUser(res.data);
					showNotification({
						title: 'Пользователь добавлен',
						autoClose: 3500,
						color: 'green',
						icon: <Check size={18} />,
					});
					e.target.reset();
				} else {
					setAddError('Ошибка добавления пользователя, попробуйте позже');
				}
			})
			.catch(error => {
				console.log(error)
				if (error.response.status === 409) {
					setAddError('Пользователь уже существует');
				} else {
					setAddError('Ошибка добавления пользователя, попробуйте позже');
				}
			})
			.finally(() => {
				setLoading(false);
			});
	}

	return (
		<Modal
			opened={opened}
			onClose={() => setOpened(false)}
			title="Добавить пользователя"
			size="lg"
			transition="fade"
			transitionDuration={300}
			transitionTimingFunction="ease"
		>
			<form onSubmit={saveUser}>
				<LoadingOverlay visible={loading} />
				<InputWrapper required label="Электронная почта" description="Электронная почта пользователя" error={emailError}>
					<Input type="email" placeholder="example@example.com" name="email" />
				</InputWrapper>
				<InputWrapper required label="Имя" description="Имя пользователя" error={nameError}>
					<Input placeholder="Иван" type="text" name="name" />
				</InputWrapper>
				<InputWrapper required label="Фамилия" description="Фамилия пользователя" error={surnameError}>
					<Input placeholder="Иванов" type="text" name="surname" />
				</InputWrapper>
				<InputWrapper required label="Возраст" description="Возраст пользователя, числом" error={ageError}>
					<Input placeholder="20" type="number" name="age" />
				</InputWrapper>
				<InputWrapper required label="Пароль" error={passwordError}>
					<Input placeholder="*****" type="text" name="password" />
				</InputWrapper>
				<InputWrapper required label="Повторите пароль" error={password_rError}>
					<Input placeholder="*****" type="text" name="password_r" />
				</InputWrapper>
				<NativeSelect
					data={['Ученик', 'Администратор']}
					placeholder="Выберите вариант"
					label="Выберите типа пользователя"
					description="Ученик может проходить курсы. Администратор отвечает за проверку заданий и создание курсов, дней, заданий"
					required
					name="status"
				/>
				<Space h="md" />
				<Center>
					<Button
						color="green"
						type="submit"
						style={{ marginRight: '20px' }}
					>
						Добавить
					</Button>
					<Button
						variant="light"
						color="dark"
						onClick={() => {setOpened(false)}}
					>
						Отменить
					</Button>
				</Center>
				<Center>
					<Text color="red">{addError}</Text>
				</Center>
			</form>
		</Modal>
	)
}
