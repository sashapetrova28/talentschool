import { withIronSessionApiRoute } from 'iron-session/next';
import { sessionOptions } from '/lib/session';

import formidable from 'formidable';
import saveFile from "/utils/saveFile";

import database from '/utils/database';

export const config = {
	api: {
		bodyParser: false,
	},
};

const mainAnswerHandler = async (req, res) => {
	const { method } = req;
	const { id } = req.query
	switch (method) {
		case 'POST':
			const form = new formidable.IncomingForm();
			form.parse(req, async (err, fields, files) => {
				if (err) {
					res.status(500).json({ errorMessage: 'Error' });
					return;
				}
				let path = [];
				console.log(files);
				for (let key of Object.keys(files)) {
					path.push(saveFile(files[key]));
				}
				const user = await database.select('*').from('users').where({ email: req.session.user.email }).limit(1);
				if (user[0].status === 'user') {
					const new_id = await database('task_messages').returning('id').insert({ task_id: id, user_id: user[0].id, message: fields.message, files: JSON.stringify(path) });
					await database('accepted_tasks').update({ status: 'check' }).where({ task_id: id, user_id: user[0].id });
					res.status(200).json({
						id: new_id[0].id,
						user_id: user[0].id,
						task_id: id,
						message: fields.message,
						files: path
					});
				} else {
					const new_id = await database('task_messages').returning('id').insert({ task_id: id, user_id: fields.user_id, message: fields.message, files: JSON.stringify(path), answer_id: user[0].id });
					await database('accepted_tasks').update({ status: fields.status }).where({ task_id: id, user_id: fields.user_id });
					res.status(200).json({
						id: new_id[0].id,
						user_id: user[0].id,
						task_id: id,
						message: fields.message,
						files: path
					});
				}
			});
			break;
		default:
			res.setHeader('Allow', ['POST']);
			res.status(405).end(`Method ${method} Not Allowed`);
	}
}

export default withIronSessionApiRoute(mainAnswerHandler, sessionOptions)