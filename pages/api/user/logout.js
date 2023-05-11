import { withIronSessionApiRoute } from "iron-session/next";

export default withIronSessionApiRoute(
  function logoutRoute(req, res, session) {
    req.session.destroy();
    res.send({ ok: true });
  },
  {
    cookieName: "user-cookies",
    password: "Fe26.2*1*d4975ceb4e4a04fcad576fa21e317250c0c308a46cb2bf6b42c65fdd8808c829*nladFil1c7pslVjpRgnvqA*Z8dM8EprxMcfSEDAiV7dCeDZzy-3Bsm-LRh1S1EHjUDnWmlXwhnJBoeu7ZzemzGc0xBI96kHDhSM0T_bbPpv3Egjxj4KPlw5h07gNjGm9UwcuQPfgWudntByXvYCJi1ozzVA_Ajha1k8fZbfWfIX4WYi49_tNcU9D99q-1yZzzrMlAkvYU-2IoIcPzso98XgoKiPRNEDrYZT7tguqXyJtOA31Ual6sDzJwnVijmrjxRrP_fZ2lgyQ1aXnUK5_yD0*1683970516167*d22989d8e5eda6346752fcf49b6022dd019f082605756bed046dd00855907892*sNcsTaYJohgwvY3rGHNgDeOk3K9VTQBStlxQabAlg5o~2",
    // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
    },
  },
);