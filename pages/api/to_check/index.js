import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "/lib/session";

import database from "/utils/database";

const tasksCheckHandler = async (req, res) => {
	const { method } = req;
	switch (method) {
		case "GET":
			const tasks = await database.select("*").from("tasks");
			const days = await database.select("*").from("days");
			const users = await database.select("*").from("users");
			const currentUser = req.session.user
			const checkCurator = users.find((user) => user.email === currentUser.email)
			const isCurator = checkCurator.status === "curator";
			const curatorId = isCurator && checkCurator.id

			const to_check = await database
				.select("*")
				.from("accepted_tasks")
				.where({ status: "check" });
			const to_check_for_curator = await database
				.select("*")
				.from("accepted_tasks")
				.whereIn('status', ["check", "waiting"]);


			const adminId = users.find((user) => user.status == "admin").id
			const curatorAccepteds = to_check_for_curator.filter((check) => check.user_id == curatorId && check.user_id != adminId)
			const curatorTasks = curatorAccepteds.map((ac) => (ac.task_id))
			const byTaskId = to_check_for_curator.filter((tch) => curatorTasks.includes((tch.task_id)) && tch.user_id != adminId)
			let to_check_ready = [];
			const usersWithoutAdmin = users.filter(user => user.status !== "admin")
			if (currentUser.status == "curator") {
				for (let forCurator of byTaskId) {
					const user = usersWithoutAdmin.find((user) => user.id == forCurator.user_id);
					const task = tasks.find((task) => task.id == forCurator.task_id);
					const day = days.find((day) => day.id == task.day_id)
					const course = await database.select("*").from("courses").where({ id: day.course_id }).limit(1)
					if (!user || !task || !day || !course) continue
					to_check_ready.push({
						user,
						task: {
							...task,
							satus: "check"
						},
						day,
						course: course[0]

					})
				}
				res.status(200).json(to_check_ready);
				break
			}
			for (let to_check_el of to_check) {
				const user = users.find((user) => user.id == to_check_el.user_id);
				const task = tasks.find((task) => task.id == to_check_el.task_id);
				const day = days.find((day) => day.id == task.day_id);
				const course = await database
					.select("*")
					.from("courses")
					.where({ id: day.course_id })
					.limit(1);

				to_check_ready.push({
					day,
					user,
					course: course[0],

					task: {
						...task,
						status: "check",
					},
				});
			}
			res.status(200).json(to_check_ready);
			break;
		default:
			res.setHeader("Allow", ["GET"]);
			res.status(405).end(`Method ${method} Not Allowed`);
	}
};

export default withIronSessionApiRoute(tasksCheckHandler, sessionOptions);