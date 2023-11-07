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
  postcss: true,
  serverDependenciesToBundle: [/^@?shiki.*/],

  browserNodeBuiltinsPolyfill: {
    modules: {
      url: true,
      crypto: true,
      util: true,
      string_decoder: true,
      events: true,
      tls: true,
      net: true,
      https: true,
      child_process: true,
      os: true,
      zlib: true,
      vm: true,
      stream: true,
      buffer: true,
      punycode: true,
      path: true,
      fs: true,
      http: true,
      assert: true,
    },
  },
};
