// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  redirects: {
    '/projects/amplifier': '/work/amplifier',
    '/projects/content-automation': '/',
  },
});
