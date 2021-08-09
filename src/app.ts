import express, { Application, Request, Response } from "express";
import fetch from "node-fetch";
import redis from "redis";
import { getPackage, getPackageJson } from "./api";
import { Package } from "./types";

const app: Application = express();
const PORT = process.env.PORT || 5000;

app.get("/", async (req: Request, res: Response) => {
  if (req.query.package) {
    const packageName = (req.query.package as string).split("/")[0];
    const version = (req.query.package as string).split("/")[1];
    // const tree: Package = await getPackage({
    //   packageName,
    //   version,
    //   dependencies: [],
    // }, [{name: packageName, father: '', version}]);
    getPackageJson(packageName, version);
    res.send(req.query.package);
  } else {
    res.send("please write package");
  }
});

app.listen(5000, () => console.log("server running"));
