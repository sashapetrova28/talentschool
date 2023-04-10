import { withIronSessionApiRoute } from 'iron-session/next';
import { sessionOptions } from '/lib/session';

import database from '/utils/database';

const mainTaskHandler = async (req, res) => {
	const { method } = req;
	const { id } = req.query
	switch (method) {
		case 'GET':
			const task = await database.select('*').from('tasks').where({ id: id });
			const day = await database.select('*').from('days').where({ id: task[0].day_id });
			const course = await database.select('*').from('courses').where({ id: day[0].course_id });
			const user = await database.select('*').from('users').where({ email: req.session.user.email }).limit(1);
			const task_status = await database.select('status').from('accepted_tasks').where({ task_id: id, user_id: user[0].id });
			const messages = await database.select('*').from('task_messages').where({task_id: id, user_id: user[0].id});
			res.status(200).json({
				task: task[0],
				course: course[0],
				day: day[0],
				task_status: task_status[0] ? task_status[0].status : 'empty',
				messages: messages
			});
			break;
		default:
			res.setHeader('Allow', ['GET']);
			res.status(405).end(`Method ${method} Not Allowed`);
	}
}

export default withIronSessionApiRoute(mainTaskHandler, sessionOptions)