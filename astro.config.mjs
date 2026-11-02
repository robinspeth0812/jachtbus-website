// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://jachtbusfoodtruck.nl',
  integrations: [
    sitemap({
      // Internal work pages stay out of the sitemap (they are noindex too).
      filter: (page) => !page.endsWith('/branding/') && !page.endsWith('/secties/'),
    }),
  ],
});
