import { withIronSessionApiRoute } from 'iron-session/next';
import { sessionOptions } from '/lib/session';
import saveFile from "/utils/saveFile";
import formidable from "formidable";

import database from '/utils/database';

export const config = {
	api: {
		bodyParser: false,
	},
};

const coursesHandler = async (req, res) => {
	if (!req.session || !req.session.user || req.session.user.status !== 'admin') {
		res.status(403).json({ errorMessage: 'Forbidden' });
		return;
	}
	const { method } = req;
	switch (method) {
		case 'GET':
			const courses = await database.select('*').from('courses');
			const connectedAlreadyUsers = await database.select(['id', 'course_id']).from('connected_courses').whereIn('course_id', courses.map(el => el.id));
			const days = await database.select('id').from('days').whereIn('course_id', courses.map(el => el.id));
			res.status(200).json(courses.map(course => {
				return {
					id: course.id,
					name: course.name,
					description: course.desciption,
					image: course.image,
					start_date: course.start_date,
					end_date: course.end_date,
					days: days.length,
					selected_users: connectedAlreadyUsers.filter(el => el.course_id === course.id).length
				}
			}));
			break;
		case 'POST':
			const form = new formidable.IncomingForm();
			form.parse(req, async (err, fields, files) => {
				if (err) {
					res.status(500).json({ errorMessage: 'Error' });
					return;
				}
				const exists_course = await database.select('*').from('courses').where({ name: fields.name }).limit(1);
				if (exists_course.length > 0) {
					res.status(409).json({ errorMessage: 'Course exists' });
					return;
				}
				const path = saveFile(files.image);
				const new_id = await database('courses').returning('id').insert({ name: fields.name, description: fields.description, image: path });
				const selectedUsers = JSON.parse(fields.selectedUsers);
				const selectedUsersIds = await database.select('id').from('users').whereIn('email', selectedUsers);
				const connectedUsers = await database('connected_courses').returning('id').insert(selectedUsersIds.map(el => {
					return {
						course_id: new_id[0].id,
						user_id: parseInt(el.id)
					}
				}));
				res.status(200).json({
					id: new_id[0].id,
					name: fields.name,
					description: fields.description,
					image: path,
					selected_users: connectedUsers.length
				});
			});
			break;
		default:
			res.setHeader('Allow', ['GET', 'POST']);
			res.status(405).end(`Method ${method} Not Allowed`);
	}
}

export default withIronSessionApiRoute(coursesHandler, sessionOptions)