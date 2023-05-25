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
			const to_check = await database
				.select("*")
				.from("accepted_tasks")
				.where({ status: "check" });
			let to_check_ready = [];
			for (let to_check_el of to_check) {
				const user = users.find((user) => user.id == to_check_el.user_id);
				const task = tasks.find((task) => task.id == to_check_el.task_id);
				const day = days.find((day) => day.id == task.day_id);
				to_check_ready.push({
					day,
					user,
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