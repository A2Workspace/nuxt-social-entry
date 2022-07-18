import { resolve } from 'path';
import type { Module } from '@nuxt/types';
import { ModuleOptions, moduleDefaults } from './options';

export default function nuxtSocialEntryModule(
  moduleOptions: Module<ModuleOptions>
) {
  // Merge all options
  const options = Object.assign(
    {},
    moduleDefaults,
    this.options.socialEntry,
    moduleOptions
  );

  // Register plugin
  this.addPlugin({
    src: resolve(__dirname, '../templates/plugin.js'),
    ssr: false,
    fileName: 'social-entry.js',
    options: {
      options,
    },
  });

  // Register alias config
  const runtime = resolve(__dirname, './runtime');
  this.options.alias['~nuxt-social-entry/runtime'] = runtime;
  this.options.build.transpile.push(__dirname);
}
