import { withIronSessionApiRoute } from 'iron-session/next';
import { sessionOptions } from '/lib/session';

import database from '/utils/database';

const mainDayHandler = async (req, res) => {
	const { method } = req;
	const { id } = req.query
	switch (method) {
		case 'GET':
			const day = await database.select('*').from('days').where({ id: id });
			const user = await database.select('*').from('users').where({ email: req.session.user.email }).limit(1);
			const course = await database.select('*').from('courses').where({ id: day[0].course_id });
			const tasks = await database.select('*').from('tasks').where({ day_id: id });
			let tasks_ready = 0;
			for (let task of tasks) {
				const task_status = await database.select('status').from('accepted_tasks').where({ task_id: task.id, user_id: user[0].id });
				if (task_status[0] && task_status[0].status === 'ready') {
					tasks_ready++;
				}
			}
			res.status(200).json({
				course: course[0],
				day: day[0],
				tasks: tasks,
				tasks_ready: tasks_ready
			});
			break;
		default:
			res.setHeader('Allow', ['GET']);
			res.status(405).end(`Method ${method} Not Allowed`);
	}
}

export default withIronSessionApiRoute(mainDayHandler, sessionOptions)