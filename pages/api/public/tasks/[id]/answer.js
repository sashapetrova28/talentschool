import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "/lib/session";

import formidable from "formidable";
import saveFile from "/utils/saveFile";

import database from "/utils/database";

export const config = {
  api: {
    bodyParser: false,
  },
};

const mainAnswerHandler = async (req, res) => {
  const { method } = req;
  const { id } = req.query;

  switch (method) {
    case "POST":
      const form = new formidable.IncomingForm();
      form.parse(req, async (err, fields, files) => {
        if (err) {
          res.status(500).json({ errorMessage: "Error" });
          return;
        }
        const path = [];
        for (let key of Object.keys(files)) {
          path.push(saveFile(files[key]));
        }
        const user = await database
          .select("*")
          .from("users")
          .where({ email: req.session.user.email })
          .limit(1);
        if (user[0].status === "user" || user[0].status === "curator") {
          const new_id = await database("task_messages")
            .returning("id")
            .insert({
              date: JSON.stringify(new Date()),
              task_id: id,
              user_id: user[0].id,
              message: fields.message,
              files: JSON.stringify(path),
            });

          await database("accepted_tasks")
            .update({ status: "check" })
            .where({ task_id: id, user_id: user[0].id });

          res.status(200).json({
            id: new_id[0].id,
            user_id: user[0].id,
            task_id: id,
            message: fields.message,
            files: path,
          });
        }
        return;
      });
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      break;
  }
};

export default withIronSessionApiRoute(mainAnswerHandler, sessionOptions);