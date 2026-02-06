import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Awesome Design Systems',
  tagline: '디자인 시스템 지식 베이스 — 81개 아티클, 12개 카테고리',
  favicon: 'img/favicon.ico',
  url: 'https://shaun0927.github.io',
  baseUrl: '/awesome-design-systems/',
  organizationName: 'shaun0927',
  projectName: 'awesome-design-systems',
  trailingSlash: false,
  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',
  i18n: {
    defaultLocale: 'ko',
    locales: ['ko'],
  },
  markdown: {
    mermaid: true,
  },
  themes: ['@docusaurus/theme-mermaid'],
  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/shaun0927/awesome-design-systems/tree/main/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],
  themeConfig: {
    navbar: {
      title: 'Awesome Design Systems',
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: '📚 Knowledge Base',
        },
        {
          href: 'https://github.com/shaun0927/awesome-design-systems',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Knowledge Base',
          items: [
            { label: 'Design Tokens', to: '/docs/category/01-design-tokens' },
            { label: 'Visual Foundations', to: '/docs/category/02-visual-foundations' },
            { label: 'Component Design', to: '/docs/category/03-component-design' },
          ],
        },
        {
          title: 'Community',
          items: [
            { label: 'GitHub', href: 'https://github.com/shaun0927/awesome-design-systems' },
          ],
        },
      ],
      copyright: `Built with ❤️ for design system practitioners. ${new Date().getFullYear()}`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['yaml', 'json', 'scss', 'bash'],
    },
    mermaid: {
      theme: { light: 'neutral', dark: 'dark' },
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
