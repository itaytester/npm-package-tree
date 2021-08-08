import express, { Application, Request, Response } from "express";
import fetch from "node-fetch";
import redis from "redis";
import { getPackage } from "./api";
import { Package } from "./types";

const app: Application = express();
const PORT = process.env.PORT || 5000;

app.get("/", async (req: Request, res: Response) => {
  if (req.query.package) {
    const tree: Package = await getPackage({
      packageName: (req.query.package as string).split("/")[0],
      version: (req.query.package as string).split("/")[1],
      dependencies: [],
    }, [(req.query.package as string).split("/")[0]]);
    res.send(req.query.package);
  } else {
    res.send("please write package");
  }
});

app.listen(5000, () => console.log("server running"));
