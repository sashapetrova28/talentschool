import { withIronSessionApiRoute } from 'iron-session/next';
import { sessionOptions } from '/lib/session';

import database from '/utils/database';

const mainCoursesHandler = async (req, res) => {
	const { method } = req;
	if (!req.session.user || !req.session.user.email) {
		res.status(302).send('/auth');
		return;
	}
	switch (method) {
		case 'GET':
			const courses = await database.select('*').from('courses');
			const user = await database.select('*').from('users').where({ email: req.session.user.email }).limit(1);
			const availableCourses = await database.select(['id', 'course_id']).from('connected_courses').where({ user_id: user[0].id });
			let ready_courses = [];
			for (let course of courses) {
				if (availableCourses.find(el => el.course_id === course.id)) {
					let tasks = 0;
					let tasks_ready = 0;
					const days_for_course = await database.select('id').from('days').where({ course_id: course.id });
					for (let day of days_for_course) {
						const task_of_course = await database.select('id').from('tasks').where({ day_id: day.id });
						for (let task of task_of_course) {
							const task_status = await database.select('status').from('accepted_tasks').where({ task_id: task.id, user_id: user[0].id });
							if (task_status[0] && task_status[0].status === 'ready') {
								tasks_ready++;
							}
							tasks++;
						}
					}
					ready_courses.push({
						course: course,
						tasks: tasks,
						tasks_ready: tasks_ready
					})
				}
			}
			res.status(200).json(ready_courses);
			break;
		default:
			res.setHeader('Allow', ['GET']);
			res.status(405).end(`Method ${method} Not Allowed`);
	}
}

export default withIronSessionApiRoute(mainCoursesHandler, sessionOptions)