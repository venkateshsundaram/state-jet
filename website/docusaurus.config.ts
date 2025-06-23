import dotenv from "dotenv";
dotenv.config(); // Load .env variables

import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: "State Jet",
  tagline: "Ultra-Lightweight Global State for React",
  favicon: "img/favicon.ico",

  // Set the production url of your site here
  url: "https://statejet.org",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "facebook", // Usually your GitHub org/user name.
  projectName: "state-jet", // Usually your repo name.

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },
  plugins: ["@docusaurus/plugin-ideal-image"],
  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          // editUrl:
          //   'https://github.com/venkateshsundaram/state-jet-website/tree/main',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ["rss", "atom"],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          // editUrl:
          //   'https://github.com/venkateshsundaram/state-jet-website/tree/main',
          // Useful options to enforce blogging best practices
          onInlineTags: "warn",
          onInlineAuthors: "warn",
          onUntruncatedBlogPosts: "warn",
        },
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: "img/docusaurus-social-card.jpg",
    navbar: {
      title: "StateJet",
      hideOnScroll: false,
      logo: {
        alt: "StateJet Logo",
        src: "img/logo.svg",
      },
      items: [
        {
          to: "/docs",
          label: "Docs",
          position: "left",
        },
        // {
        //   to: '/blog',
        //   label: 'Blog',
        //   position: 'left'
        // },
        {
          to: "/help",
          label: "Help",
          position: "left",
        },
        {
          href: "https://github.com/venkateshsundaram/state-jet",
          label: "GitHub",
          position: "right",
        },
        {
          href: "https://deepwiki.com/venkateshsundaram/state-jet",
          label: "Wiki",
          position: "right",
        },
        {
          type: "docsVersionDropdown",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Docs",
          items: [
            {
              label: "Introduction",
              to: "/docs",
            },
          ],
        },
        {
          title: "Community",
          items: [
            {
              label: "Stack Overflow",
              href: "https://stackoverflow.com/questions/tagged/state-jet?sort=active",
            },
            {
              label: "Discord",
              href: "https://discord.gg/fxjXrHBVNH",
            },
            {
              label: "X",
              href: "https://x.com/statejet/",
            },
          ],
        },
        {
          title: "More",
          items: [
            // {
            //   label: 'Blog',
            //   to: '/blog',
            // },
            {
              label: "GitHub",
              href: "https://github.com/venkateshsundaram/state-jet",
            },
            {
              label: "Wiki",
              href: "https://deepwiki.com/venkateshsundaram/state-jet",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} StateJet, Inc. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
    algolia: {
      appId: process.env.DOCUSAURUS_ALGOLIA_APP_ID,
      apiKey: process.env.DOCUSAURUS_ALGOLIA_API_KEY,
      indexName: process.env.DOCUSAURUS_ALGOLIA_INDEX_NAME,
      contextualSearch: true,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
