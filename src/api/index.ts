import fetch, { Response } from "node-fetch";
import semver from "semver";
import { Package, PackageData } from "../types";
import redis from "redis"; 
import { promisify } from "util";

const REDIS_PORT: any = process.env.PORT || 6379;
const client = redis.createClient(REDIS_PORT);
const getAsync = promisify(client.get).bind(client);


export const getPackage = async ({
  packageName,
  version,
}: Package, route: string []): Promise<Package> => {
  console.log(`${route.length} ${packageName} ${version}`);
  const redisJson = await getAsync(packageName);
  let json = undefined;
  if(!redisJson) {
    const npmPackage = await fetch(`https://registry.npmjs.org/${packageName}`);
    json = await npmPackage.json();
    client.set(packageName, JSON.stringify(json));
  } else {
    json = JSON.parse(redisJson);
  }
  try {
    const cleanVersion = semver.maxSatisfying(
      Object.keys(json.versions),
      version
      );
      const dependencies = cleanVersion ? {
        ...json.versions[cleanVersion].dependencies,
        ...json.versions[cleanVersion].devDependencies,
      } : {};
      
      //checks if dependency list is empty, thus making the dependency a leaf in the tree
      if (Object.keys(dependencies).length !== 0) {
        let root: Package = { packageName, version, dependencies: [] };
        for (const dependency in dependencies) {
          if(!route.includes(dependency) && dependency !== 'test262' && dependency !== 'esprima-moz') {
            //route.push(dependency);
            let tree = await getPackage({
              packageName: dependency,
              version: dependencies[dependency],
              dependencies: [],
            }, [...route, dependency]);
            root.dependencies.push(tree);
          }
        }
        return root;
      } else {
        return { packageName, version, dependencies: [] };
      }
    } catch(e){
      console.log(`error in package: ${packageName}`);
      return { packageName, version, dependencies: [] }
    }
};

// const getVersions = async ( packageName: string) => {
//   const npmPackage = await fetch(
//     `https://registry.npmjs.org/${packageName}`
//   );
//   const json = await npmPackage.json();
//   for(version in json.versions) {

//   }
// }
