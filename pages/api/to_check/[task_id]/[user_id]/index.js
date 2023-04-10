import { withIronSessionApiRoute } from 'iron-session/next';
import { sessionOptions } from '/lib/session';

import database from '/utils/database';

const tasksCheckHandler = async (req, res) => {
	const { method } = req;
	const { task_id, user_id } = req.query;
	switch (method) {
		case 'GET':
			const user = await database.select('*').from('users').where({id: user_id});
			const chat = await database.select('*').from('task_messages').where({task_id: task_id, user_id: user_id});
			const task = await database.select('*').from('tasks').where({task_id: task_id}).limit(1);
			res.status(200).json({
				user: user,
				task: task,
				chat: chat
			});
			break;
		default:
			res.setHeader('Allow', ['GET']);
			res.status(405).end(`Method ${method} Not Allowed`);
	}
}

export default withIronSessionApiRoute(tasksCheckHandler, sessionOptions)