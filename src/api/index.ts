import fetch, { Response } from "node-fetch";
import semver from "semver";
import { Dependencies, Package, PackageData, RouteObject } from "../types";
import redis from "redis";
import { promisify } from "util";

const REDIS_PORT: string = process.env.PORT || "6379";
const client = redis.createClient(REDIS_PORT);
const getAsync = promisify(client.get).bind(client);

export const getPackage = async (
  { packageName, version }: Package,
  route: RouteObject[]
): Promise<Package> => {
  console.log(`${route.length} ${packageName} ${version}`);
  try {
    const dependencies: Dependencies = await getPackageJson(
      packageName,
      version
    );
    //checks if dependency list is empty, thus making the dependency a leaf in the tree
    if (Object.keys(dependencies).length !== 0) {
      let root: Package = { packageName, version, dependencies: [] };
      for (const dependency in dependencies) {
        if (checkRouteForCycles(route, dependency)) {
          let tree = await getPackage(
            {
              packageName: dependency,
              version: dependencies[dependency],
              dependencies: [],
            },
            [...route, { name: dependency, father: packageName, version }]
          );
          root.dependencies.push(tree);
        }
      }
      return root;
    } else {
      return { packageName, version, dependencies: [] };
    }
  } catch (e) {
    console.log(`error in package: ${packageName}`);
    return { packageName, version, dependencies: [] };
  }
};

export const checkRouteForCycles = (
  route: RouteObject[],
  dependency: string
) => {
  return route.filter((d) => d.name === dependency && dependency).length === 0;
};

const getPackageJson = async (
  packageName: string,
  version: string
): Promise<Dependencies> => {
  const redisJson = await getAsync(packageName);

  let json: PackageData = {};
  if (!redisJson) {
    const npmPackage = await fetch(`https://registry.npmjs.org/${packageName}`);
    json = await npmPackage.json();
    if (json.error || !json.versions) return {};
    client.set(packageName, JSON.stringify(json));
  } else {
    json = JSON.parse(redisJson);
  }
  const cleanVersion = semver.maxSatisfying(
    Object.keys(json.versions ? json.versions : {}),
    version !== "latest" ? version : "*"
  );
  const { versions } = json;
  const dependencies: Dependencies =
    cleanVersion && versions
      ? {
          ...versions[cleanVersion]?.dependencies,
          ...versions[cleanVersion]?.devDependencies,
        }
      : {};
  return dependencies;
};

const createVersionArray = (versions: any) => {};
