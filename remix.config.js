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
  future: {
    v2_routeConvention: true,
    v2_errorBoundary: true,
    v2_dev: true,
    v2_headers: true,
    v2_meta: true,
    v2_normalizeFormMethod: true,
  },
};
