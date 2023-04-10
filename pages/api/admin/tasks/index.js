import { withIronSessionApiRoute } from 'iron-session/next';
import { sessionOptions } from '/lib/session';
import formidable from "formidable";
import saveFile from "/utils/saveFile";

import database from '/utils/database';

export const config = {
	api: {
		bodyParser: false,
	},
};

const tasksHandler = async (req, res) => {
	const { method } = req;
	const { day_id } = req.query
	switch (method) {
		case 'GET':
			const tasks = await database.select('*').from('tasks').where({ day_id: day_id });
			res.status(200).json(tasks);
			break;
		case 'POST':
			const form = new formidable.IncomingForm();
			form.parse(req, async (err, fields, files) => {
				if (err) {
					res.status(500).json({ errorMessage: 'Error' });
					return;
				}
				const exists_tasks = await database.select('*').from('tasks').where({ name: fields.name, day_id: day_id }).limit(1);
				if (exists_tasks.length > 0) {
					res.status(409).json({ errorMessage: 'Task exists' });
					return;
				}
				let path = [];
				for (let key of Object.keys(files)){
					path.push(saveFile(files[key]));
				}
				const new_id = await database('tasks')
					.returning('id')
					.insert({
						name: fields.name,
						description: fields.description,
						files: JSON.stringify(path),
						day_id: day_id
					});
				res.status(200).json({
					id: new_id[0].id,
					name: fields.name,
					description: fields.description,
					files: path
				});
			});
			break;
		default:
			res.setHeader('Allow', ['GET', 'POST']);
			res.status(405).end(`Method ${method} Not Allowed`);
	}
}

export default withIronSessionApiRoute(tasksHandler, sessionOptions)