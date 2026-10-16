import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { SITE } from './src/config/site.ts';
import { KA_NOINDEX } from './src/i18n/routes.ts';

export default defineConfig({
  site: SITE.url,
  trailingSlash: 'always',
  i18n: {
    defaultLocale: 'tr',
    locales: ['tr', 'ka'],
    routing: { prefixDefaultLocale: false },
  },
  build: { format: 'directory' },
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/tesekkurler/') && !page.includes('/404') && !(KA_NOINDEX && page.includes('/ka/')),
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
    }),
  ],
});
