import { useState } from 'react';

import { Modal, InputWrapper, Input, Group, Text, Space, Button, useMantineTheme, Center, LoadingOverlay, MultiSelect } from '@mantine/core';
import RichTextEditor from '/components/RichText';
import { nanoid } from 'nanoid';
import { showNotification } from '@mantine/notifications';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { Upload, X, Photo, Check } from 'tabler-icons-react';
import axios from '/utils/rest';

export const EditDay = ({ opened, setOpened, pushDay, courseId }) => {
	const [loading, setLoading] = useState(false);

	const [addError, setAddError] = useState('');

	const [nameError, setNameError] = useState('');
	const [videoError, setVideoError] = useState('');

	const [description, setDescription] = useState('');
	const [image, setImage] = useState('');
	const [createObjectURL, setCreateObjectURL] = useState(null);

	const theme = useMantineTheme();

	const getIconColor = (status, theme) => {
		return status.accepted
			? theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 4 : 6]
			: status.rejected
				? theme.colors.red[theme.colorScheme === 'dark' ? 4 : 6]
				: theme.colorScheme === 'dark'
					? theme.colors.dark[0]
					: theme.colors.gray[7];
	}

	const ImageUploadIcon = ({
		status,
		...props
	}) => {
		if (status.accepted) {
			return <Upload {...props} />;
		}

		if (status.rejected) {
			return <X {...props} />;
		}

		return <Photo {...props} />;
	}

	const dropzoneChildren = (status, theme) => (
		<Group position="center" spacing="xl" style={{ minHeight: 220, pointerEvents: 'none' }}>
			{createObjectURL ? <img src={createObjectURL} width={100} /> :
				<ImageUploadIcon status={status} style={{ color: getIconColor(status, theme) }} size={80} />}
			<div>
				<Text size="xl" inline>
					Переместите фото сюда
				</Text>
			</div>
		</Group>
	);

	const saveDay = (e) => {
		e.preventDefault();
		setNameError('');
		setAddError('');
		if (e.target.name.value === '') {
			setNameError('Введите название дня');
			return;
		}

		setLoading(true);

		const body = new FormData();
		body.append("name", e.target.name.value);
		body.append("description", description);
		const youtubeRegExp = /(?:https?:\/\/)?(?:www\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\/?\?v=|\/embed\/|\/shorts\/|\/)(\w+)/;
		const video_id = youtubeRegExp.exec(e.target.video.value);
		body.append("video", 'https://www.youtube.com/embed/' + video_id[1]);
		if (image) {
			body.append("image", image, `day_${nanoid()}`);
		}
		axios.post(`/courses/${courseId}/days`, body)
			.then(res => {
				if (res.status === 200) {
					pushDay(res.data);
					showNotification({
						title: 'День добавлен',
						autoClose: 3500,
						color: 'green',
						icon: <Check size={18} />,
					});
					e.target.reset();
				} else {
					setAddError('Ошибка добавления дня, попробуйте позже');
				}
			})
			.catch(error => {
				console.log(error)
				if (error.response.status === 409) {
					setAddError('День уже существует');
				} else {
					setAddError('Ошибка добавления дня, попробуйте позже');
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
			title="Изменить День"
			size="lg"
			transition="fade"
			transitionDuration={300}
			transitionTimingFunction="ease"
		>
			{description.length > 0 && <form onSubmit={saveDay}>
				<LoadingOverlay visible={loading} />
				<InputWrapper required label="Название дня" description="Название дня в свободной форме, будет отображаться в качесвте заголовка" error={nameError}>
					<Input type="text" name="name" />
				</InputWrapper>
				<InputWrapper label="Видео" description="Ссылка на видео с YouTube" error={videoError}>
					<Input type="text" name="video" />
				</InputWrapper>
				<Space h="md" />
				<Text>Описание</Text>
				<RichTextEditor
					name="description"
					value={description}
					onChange={value => { setDescription(value) }}
					controls={
						[
							['bold', 'italic', 'underline', 'link'],
							['unorderedList', 'orderedList'],
							['h1', 'h2', 'h3'],
							['sup', 'sub'],
							['alignLeft', 'alignCenter', 'alignRight'],
						]
					}
					style={{ height: '400px', overflow: 'auto' }}
				/>
				<Space h="md" />
				<Text>Изображение</Text>
				<Dropzone
					onDrop={(files) => {
						setImage(files[0]);
						setCreateObjectURL(URL.createObjectURL(files[0]));
					}}
					onReject={() => {
						showNotification({
							title: 'Файл отклонен',
							autoClose: 3500,
							color: 'red',
							icon: <X size={18} />,
						});
					}}
					maxSize={3 * 1024 ** 2}
					accept={IMAGE_MIME_TYPE}
					padding="xs"
				>
					{(status) => dropzoneChildren(status, theme)}
				</Dropzone>
				<Space h="md" />
				<Center>
					<Button
						color="green"
						type="submit"
						style={{ marginRight: '20px' }}
					>
						Сохранить
					</Button>
					<Button
						variant="light"
						color="dark"
						onClick={() => { setOpened(false) }}
					>
						Отменить
					</Button>
				</Center>
				<Center>
					<Text color="red">{addError}</Text>
				</Center>
			</form>}
		</Modal>
	)
}
