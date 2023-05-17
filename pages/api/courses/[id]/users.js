import { withIronSessionApiRoute } from "iron-session/next"
import { sessionOptions } from "/lib/session"
import database from "/utils/database"

async function getConnectedCoureses(course_id) {
	//получение user id в функции, чтобы просто вызвать, а не переписать одно и тоже
	const connected_courses = await database
		.select("user_id")
		.from("connected_courses")
		.where("course_id", course_id)

	return connected_courses
}

const courseUsersHandler = async (req, res) => {
	const { method } = req
	const body = req.body
	const { id } = req.query
	const exists_course = await database
		.select("*")
		.from("courses")
		.where({ id: id })
		.limit(1)
	if (exists_course.length <= 0) {
		res.status(410).json({ errorMessage: "Course not exists" })
		return
	}
	switch (method) {
		case "GET":
			const connected_courses = await getConnectedCoureses(exists_course[0].id)
			const connected_users = await database
				.select("email", "id")
				.from("users")
				.whereIn(
					"id",
					connected_courses.map((el) => el.user_id)
				)
			res.status(200).json(connected_users)
			break
			//в этом case должен обрабатываться запрос, сначала запись в бд
		case "POST":
			// тут insert ом добавляем в бд, потом по логике которая тут была {получаем id курса 
			// и по нему всех user ов подписанных на него. он дает новый массив и это отправляем в front-ui}
			await database("connected_courses").insert({
				user_id: body.id,
				course_id: Number(exists_course[0].id),
			})
			const refetched_connected_courses = await getConnectedCoureses(
				Number(exists_course[0].id)
			)

			const get_after_creating_new_user_for_connected_courses = await database
				.select("email", "id")
				.from("users")
				.whereIn(
					"id",
					refetched_connected_courses.map((el) => el.user_id)
				)
				res.status(200).json(get_after_creating_new_user_for_connected_courses)
				break
		case "DELETE":
			await database("connected_courses")
			.where({
				course_id: Number(exists_course[0].id),
				user_id: Number(req.query.body),
			})
			.del()
			const refetched_connected_courses_after_delete =
				await getConnectedCoureses(exists_course[0].id)
			const get_after_deleting_new_user_for_connected_courses = await database
				.select("email", "id")
				.from("users")
				.whereIn(
					"id",
					refetched_connected_courses_after_delete.map((el) => el.user_id)
				)
				res.status(200).json(get_after_deleting_new_user_for_connected_courses)
				break
		default:
			res.setheader("allow", ["get"])
			res.status(405).end(`method ${method} not allowed`)
	}
}

export default withIronSessionApiRoute(courseUsersHandler, sessionOptions)