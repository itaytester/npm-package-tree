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
}

export interface Dependencies {
    [key: string]: Dependency;
}
  
export interface Dependency {
  version: string;
}

export interface RouteObject {
  name: string;
  version: string;
  father: string;
}
