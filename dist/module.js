'use strict';

const path = require('path');

const moduleDefaults = {
  url: "",
  endpoints: {
    authorization: "http://localhost:8000/auth/socialite",
    token: "/auth/socialite/token",
    login: "/auth/socialite/login",
    connect: "/auth/socialite/connect",
    disconnect: "/auth/socialite/disconnect"
  }
};

function nuxtSocialEntryModule(moduleOptions) {
  const options = Object.assign({}, moduleDefaults, this.options.socialEntry, moduleOptions);
  this.addPlugin({
    src: path.resolve(__dirname, "../templates/plugin.js"),
    ssr: false,
    fileName: "social-entry.js",
    options: {
      options
    }
  });
  const runtime = path.resolve(__dirname, "./runtime");
  this.options.alias["~nuxt-social-entry/runtime"] = runtime;
  this.options.build.transpile.push(__dirname);
}

module.exports = nuxtSocialEntryModule;
