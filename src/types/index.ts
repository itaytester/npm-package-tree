export interface Package {
    packageName: string,
    version: string,
    dependencies: Package[]
}

export interface PackageData {
    name: string,
    versions: Version[],
    error: boolean
}

export interface Version {
    name: string,
    description: string,
    version: string, 
    dependencies: string[]
}

export interface RouteObject {
    name: string,
    version: string,
    father: string
}