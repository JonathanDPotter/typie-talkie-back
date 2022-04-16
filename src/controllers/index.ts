import { Request, Response } from "express";
import data from "../../welcome.json";

const welcome = (req: Request, res: Response) => {
  res.json(data);
};

export default { welcome };
