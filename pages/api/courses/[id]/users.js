import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "/lib/session";

import database from "/utils/database";

const courseUsersHandler = async (req, res) => {
  const { method } = req;
  const body = req.body;
  const { id } = req.query;
  const exists_course = await database
    .select("*")
    .from("courses")
    .where({ id: id })
    .limit(1);
  if (exists_course.length <= 0) {
    res.status(410).json({ errorMessage: "Course not exists" });
    return;
  }
  switch (method) {
    case "GET":
      const connected_courses = await database
        .select("user_id")
        .from("connected_courses")
        .where({ course_id: exists_course[0].id });
      const connected_users = await database
        .select("email")
        .from("users")
        .whereIn(
          "id",
          connected_courses.map((el) => el.user_id)
        );
      res.status(200).json(connected_users.map((el) => el.email));
      break;
	  //в этом case должен обрабатываться запрос, сначала запись в бд
    case "POST":
      await database("connected_courses").insert({
        user_id: body.id,
        email: body.email,
      });
      res.status(200).json(connected_users.map((el) => el.email));

    default:
      res.setheader("allow", ["get"]);
      res.status(405).end(`method ${method} not allowed`);
  }
};

export default withIronSessionApiRoute(courseUsersHandler, sessionOptions);