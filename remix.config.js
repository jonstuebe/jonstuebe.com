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

  browserNodeBuiltinsPolyfill: {
    modules: {
      url: true,
      crypto: true,
      util: true,
      string_decoder: true,
      events: true,
      tls: true,
      net: true,
    },
  },
};
