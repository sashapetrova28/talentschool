import CryptoJS from "crypto-js";
import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "/lib/session";
import database from "/utils/database";

const authHandler = async (req, res) => {
  const { method } = req;
  switch (method) {
    case "POST":
      const {
        body: { email, password },
      } = req;
      const user = await database
        .select("*")
        .from("users")
        .where({ email: email })
        .limit(1);
      if (user.length === 1) {
        if (user[0].password === password) {
          req.session.user = user[0];
          await req.session.save();
          res.status(200).json(user[0]);
        } else {
          res.status(403).json({ errorMessage: { user: user[0], password } });
        }
      } else {
        res.status(404).json({ errorMessage: "Пользователь не найден" });
      }
      break;
    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default withIronSessionApiRoute(authHandler, sessionOptions);

// export default authHandler;