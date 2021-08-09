export interface Package {
  packageName: string;
  version: string;
  dependencies: Package[];
}

export interface PackageData {
  name?: string;
  versions?: Versions;
  error?: boolean;
}

export interface Versions {
  [key: string]: Version;
}

export interface Version {
  name: string;
  description: string;
  version: string;
  dependencies: Dependencies;
  devDependencies: Dependencies;
}

export interface Dependencies {
    [key: string]: string;
}

export interface RouteObject {
  name: string;
  version: string;
  father: string;
}
