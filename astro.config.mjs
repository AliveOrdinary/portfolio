// @ts-check
import { defineConfig } from 'astro/config';

// Old URLs are redirected by Netlify (netlify.toml), so there's no in-between page.
export default defineConfig({
  output: 'static',
});
