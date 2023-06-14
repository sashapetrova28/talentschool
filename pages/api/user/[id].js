import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "/lib/session";
import CryptoJS from "crypto-js";
import database from "/utils/database";

const SECRET_KEY = process.env.SECRET_KEY;
const userHandler = async (req, res) => {
  const { method } = req;
  const { id } = req.query;
  const exists_user = await database
    .select("*")
    .from("users")
    .where({ id: id })
    .limit(1);
  if (exists_user.length <= 0) {
    res.status(410).json({ errorMessage: "User not exists" });
    return;
  }
  switch (method) {
    case "GET":
      res.status(200).json(exists_user[0]);
      break;
    case "PUT":
      if (
        !req.session ||
        !req.session.user ||
        req.session.user.status !== "admin"
      ) {
        res.status(403).json({ errorMessage: "Forbidden" });
        break;
      }
      const {
        body: { id, email, name, surname, password, age, status },
      } = req;
      const check_new_email = await database
        .select("*")
        .from("users")
        .where({ email: email })
        .limit(1);
      if (check_new_email.length <= 0) {
        res.status(409).json({ errorMessage: "Email doesn't exists" });
        break;
      }

      // const check_new_name = await database.select('*').from('users').where({name: name}).limit(1);
      // if (check_new_name.length > 0){
      // res.status(409).json({ errorMessage: 'Name the same'});
      // break;
      // }

      const updated_user = await database("users")
        .returning([
          "id",
          "email",
          "name",
          "surname",
          "age",
          "password",
          "status",
        ])
        .update({
          email: email,
          name: name,
          surname: surname,
          age: age,
          password: password,
          status: status,
        })
        .where({ id: id });
      res.status(200).json({
        user: updated_user[0],
      });
      break;
    case "DELETE":
      if (
        !req.session ||
        !req.session.user ||
        req.session.user.status !== "admin"
      ) {
        res.status(403).json({ errorMessage: "Forbidden" });
        break;
      }
      const deleted_user = await database("users")
        .returning("id")
        .del()
        .where({ id: id });
      res.status(200).json({
        id: deleted_user[0].id,
      });
      break;
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default withIronSessionApiRoute(userHandler, sessionOptions);