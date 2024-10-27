import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
export default {
  preprocess: vitePreprocess(),

  kit: {
    adapter: adapter(),
    paths: {
      base: process.argv.includes('dev') ? '' : '/ThelowDamageCalculation',
    },
  }
};
