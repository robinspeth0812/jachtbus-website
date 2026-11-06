// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://jachtbusfoodtruck.nl',
  integrations: [
    sitemap({
      // Internal work pages and redirects stay out of the sitemap (they are noindex too).
      filter: (page) => !page.endsWith('/branding/') && !page.endsWith('/branding-2/') && !page.endsWith('/secties/') && !page.includes('/nieuw') && !page.endsWith('/events/'),
    }),
  ],
  // The old site had /events. Old /nieuw links: src/pages/nieuw/[...pad].astro.
  // Bunny edge rules can turn these into real 301s later.
  redirects: {
    '/events': '/agenda/',
  },
});
