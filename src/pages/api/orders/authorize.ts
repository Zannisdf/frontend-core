import { NextApiRequest, NextApiResponse } from "next";

const authorize = (req: NextApiRequest, res: NextApiResponse) => {
  console.log("authorized", req.body);

  return res.status(201).json({ status: "ok" });
};

export default authorize;
