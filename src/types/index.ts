export interface Package {
    packageName: string,
    version: string,
    dependencies: Package[]
}

export interface PackageData {
    name: string,
    versions: Version[]
}

export interface Version {
    name: string,
    description: string,
    version: string, 
    dependencies: string[]
}