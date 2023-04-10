import { withIronSessionApiRoute } from 'iron-session/next';
import { sessionOptions } from '/lib/session';

import database from '/utils/database';

const taskHandler = async (req, res) => {
	const { method } = req;
	const { id } = req.query
	const exists_task = await database.select('*').from('tasks').where({ id: id }).limit(1);
	if (exists_task.length <= 0) {
		res.status(410).json({ errorMessage: 'Task not exists' });
		return;
	}
	switch (method) {
		case 'GET':
			res.status(200).json(exists_task[0]);
			break;
		case 'PUT':
			res.status(403).json({ errorMessage: 'Forbidden' });
			break;
		case 'DELETE':
			if (!req.session || !req.session.user || req.session.user.status !== 'admin') {
				res.status(403).json({ errorMessage: 'Forbidden' });
				break;
			}
			const deleted_task = await database('tasks').returning('id').del().where({ id: id });
			res.status(200).json({
				id: deleted_task[0].id
			})
			break;
		default:
			res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
			res.status(405).end(`Method ${method} Not Allowed`);
	}
}

export default withIronSessionApiRoute(taskHandler, sessionOptions)