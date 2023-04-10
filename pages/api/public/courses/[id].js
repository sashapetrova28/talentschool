import { withIronSessionApiRoute } from 'iron-session/next';
import { sessionOptions } from '/lib/session';

import database from '/utils/database';

const mainCoursesOneHandler = async (req, res) => {
	const { method } = req;
	const { id } = req.query
	switch (method) {
		case 'GET':
			const courses = await database.select('*').from('courses').where({ id: id });
			const user = await database.select('*').from('users').where({ email: req.session.user.email }).limit(1);
			const availableCourses = await database.select(['id', 'course_id']).from('connected_courses').where({ user_id: user[0].id, course_id: courses[0].id });
			if (availableCourses.length > 0) {
				let days = await database.select('*').from('days').where({ course_id: courses[0].id });
				let tasks = 0;
				let tasks_ready = 0;
				for (let index in days) {
					let show_day = false;
					let tasks_day = 0;
					let tasks_ready_day = 0;
					const task_of_course = await database.select('id').from('tasks').where({ day_id: days[index].id });
					for (let task of task_of_course) {
						const task_status = await database.select('status').from('accepted_tasks').where({ task_id: task.id, user_id: user[0].id });
						if (task_status[0] && task_status[0].status === 'ready') {
							tasks_ready++;
							tasks_ready_day++;
						}
						tasks++;
						tasks_day++;
					}
					if (tasks_day === tasks_ready_day) {
						show_day = true;
					}
					days[index].show_day = show_day;
				}
				res.status(200).json({
					course: courses[0],
					days: days,
					tasks: tasks,
					tasks_ready: tasks_ready
				});
			} else {
				res.status(403).json({ errorMessage: 'Forbidden' });
			}
			break;
		default:
			res.setHeader('Allow', ['GET']);
			res.status(405).end(`Method ${method} Not Allowed`);
	}
}

export default withIronSessionApiRoute(mainCoursesOneHandler, sessionOptions)