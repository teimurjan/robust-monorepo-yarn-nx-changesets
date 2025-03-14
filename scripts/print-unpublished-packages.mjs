import { getPackages } from "@manypkg/get-packages";
import packageJson from "package-json";

const printUnpublishedPackages = async () => {
  const cwd = process.cwd();
  const { packages } = await getPackages(cwd);

  const unpublishedPackages = [];

  for (const pkg of packages) {
    const { packageJson: pkgJson } = pkg;

    if (!pkgJson.name || !pkgJson.version || pkgJson.private) {
      continue;
    }

    try {
      const publishedPackage = await packageJson(pkgJson.name, {
        allVersions: true,
      });
      const publishedVersions = Object.keys(publishedPackage.versions);

      if (!publishedVersions.includes(pkgJson.version)) {
        unpublishedPackages.push(pkgJson.name);
      }
    } catch (error) {
      if (error.name === "PackageNotFoundError") {
        unpublishedPackages.push(pkgJson.name);
      }
    }
  }

  console.log(unpublishedPackages.join(","));
};

printUnpublishedPackages();
