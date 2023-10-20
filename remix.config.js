/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  publicPath: "/build/",
  // serverBuildPath: "./api/_build/index.js",
  serverBuildPath: "api/index.js",
  assetsBuildDirectory: "public/build",
  serverMainFields: ["main", "module"],
  serverModuleFormat: "cjs",
  serverPlatform: "node",
  serverMinify: false,

  appDirectory: "app",
  ignoredRouteFiles: [".*"],
  tailwind: true,
};
