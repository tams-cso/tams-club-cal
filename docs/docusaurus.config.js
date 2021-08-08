const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
    title: 'Documentation - TAMS Club Calendar',
    tagline: 'Documentation site for development of the TAMS Club Calendar.',
    url: 'https://docs.tams.club',
    baseUrl: '/',
    onBrokenLinks: 'throw',
    onBrokenMarkdownLinks: 'warn',
    favicon: 'img/favicon.ico',
    organizationName: 'MichaelZhao21', // Usually your GitHub org/user name.
    projectName: 'tams-club-cal', // Usually your repo name.
    themeConfig: {
        navbar: {
            title: 'TAMS Club Calendar Docs',
            logo: {
                alt: 'Logo',
                src: 'img/logo.svg',
            },
            items: [
                {
                    type: 'doc',
                    docId: 'intro',
                    position: 'left',
                    label: 'Go to Docs',
                },
                {
                    href: 'https://github.com/MichaelZhao21/tams-club-cal',
                    label: 'GitHub',
                    position: 'right',
                },
            ],
        },
        footer: {
            style: 'dark',
            links: [
                {
                    title: 'Docs',
                    items: [
                        {
                            label: 'Tutorial',
                            to: '/docs/intro',
                        },
                    ],
                },
                {
                    title: 'Links',
                    items: [
                        {
                            label: 'Github',
                            href: 'https://github.com/MichaelZhao21/tams-club-cal',
                        },
                        {
                            label: 'Main site',
                            href: 'https://tams.club',
                        },
                        {
                            label: 'Staging deployment',
                            href: 'https://staging.tams.club',
                        },
                    ],
                },
                {
                    title: 'Contact',
                    items: [
                        {
                            label: 'Michael Zhao',
                            href: 'mailto:me@michaelzhao.xyz',
                        },
                        {
                            label: 'Create a Github Issue',
                            href: 'https://github.com/MichaelZhao21/tams-club-cal/issues/new/choose',
                        },
                    ],
                },
            ],
            copyright: `Licensed © ${new Date().getFullYear()} Michael Zhao under the MIT License. Docs built with Docusaurus.`,
        },
        prism: {
            theme: lightCodeTheme,
            darkTheme: darkCodeTheme,
        },
    },
    presets: [
        [
            '@docusaurus/preset-classic',
            {
                docs: {
                    sidebarPath: require.resolve('./sidebars.js'),
                    // Please change this to your repo.
                    editUrl: 'https://github.com/MichaelZhao21/tams-club-cal',
                },
                theme: {
                    customCss: require.resolve('./src/css/custom.css'),
                },
            },
        ],
    ],
};
