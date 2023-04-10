import { withIronSessionApiRoute } from 'iron-session/next';
import { sessionOptions } from '/lib/session';

import database from '/utils/database';

const tasksCheckHandler = async (req, res) => {
	const { method } = req;
	switch (method) {
		case 'GET':
			const tasks = await database.select('*').from('tasks');
			const days = await database.select('*').from('days').whereIn('id', tasks.map(el => el.day_id));
			const users = await database.select('*').from('users');
			const to_check = await database.select('*').from('accepted_tasks').where({ status: 'check' });
			let to_check_ready = [];
			for (let to_check_el of to_check) {
				to_check_ready.push({
					user: users.find(el => el.id === to_check_el.user_id),
					task: {
						...tasks.find(el => el.id === to_check_el.task_id),
						status: 'check'
					},
					day: days.find(el => el.id === tasks.find(el => el.id === to_check_el.task_id).day_id)
				})
			}
			res.status(200).json(to_check_ready);
			break;
		default:
			res.setHeader('Allow', ['GET']);
			res.status(405).end(`Method ${method} Not Allowed`);
	}
}

export default withIronSessionApiRoute(tasksCheckHandler, sessionOptions)