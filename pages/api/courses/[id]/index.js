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

const courseHandler = async (req, res) => {
	const { method } = req;
	const { id } = req.query
	const exists_course = await database.select('*').from('courses').where({ id: id }).limit(1);
	if (exists_course.length <= 0) {
		res.status(410).json({ errorMessage: 'Course not exists' });
		return;
	}
	switch (method) {
		case 'GET':
			res.status(200).json(exists_course[0]);
			break;
		case 'PUT':
			if (!req.session || !req.session.user || req.session.user.status !== 'admin') {
				res.status(403).json({ errorMessage: 'Forbidden' });
				break;
			}
			const form = new formidable.IncomingForm();
			form.parse(req, async (err, fields, files) => {
				if (err) {
					res.status(500).json({ errorMessage: 'Error' });
					return;
				}
				const check_new_name = await database.select('*').from('courses').where({ name: fields.name }).limit(1);
				if (check_new_name.length > 0 && check_new_name[0].id !== id) {
					res.status(409).json({ errorMessage: 'Course exists' });
					return;
				}
				let path = false;
				if (files.image) {
					path = saveFile(files.image);
				}
				let updated_course = await database('courses')
					.returning(['id', 'name', 'description', 'image'])
					.update({
						name: fields.name,
						description: fields.description,
					})
					.where({ id: id });
				if (path) {
					updated_course = await database('courses')
						.returning(['id', 'name', 'description', 'image'])
						.update({
							image: path
						})
						.where({ id: id });
				}
				res.status(200).json({
					course: updated_course[0]
				})
			});
			break;
		case 'DELETE':
			if (!req.session || !req.session.user || req.session.user.status !== 'admin') {
				res.status(403).json({ errorMessage: 'Forbidden' });
				break;
			}
			const deleted_course = await database('courses').returning('id').del().where({ id: id });
			res.status(200).json({
				id: deleted_course[0].id
			})
			break;
		default:
			res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
			res.status(405).end(`Method ${method} Not Allowed`);
	}
}

export default withIronSessionApiRoute(courseHandler, sessionOptions)