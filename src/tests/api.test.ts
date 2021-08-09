import redis from "redis-mock";
const { checkRouteForCycles } = require("../api");

const MOCK_PACKAGE = { packageName: "express", version: "1.0.0", depe: [] };

describe("Should get package", () => {
  jest.mock("redis", () => redis);

  test("get package", () => {
    checkRouteForCycles(
      {
        packageName: MOCK_PACKAGE.packageName,
        version: MOCK_PACKAGE.version,
        dependencies: [],
      },
      [
        {
          name: MOCK_PACKAGE.packageName,
          version: MOCK_PACKAGE.version,
          father: "",
        },
      ]
    );
  });
});
