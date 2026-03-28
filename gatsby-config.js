import { siteUrl } from "./src/constants/config";
const config = {
    siteMetadata: {
        title: `Zenless Zone Zero Music`,
        siteUrl: siteUrl,
    },
    graphqlTypegen: true,
    plugins: [
        "gatsby-plugin-postcss",
        {
            resolve: "gatsby-plugin-manifest",
            options: {
                icon: "static/logo/logo.svg",
                name: "Zenless Zone Zero Music",
                short_name: "ZZZ Music",
                start_url: "/?utm_source=pwa",
                background_color: "#18181b",
                theme_color: "#18181b",
                display: "standalone",
            },
        },
        {
            resolve: "gatsby-plugin-offline",
            options: {
                precachePages: [],
                workboxConfig: {
                    globPatterns: [],
                    runtimeCaching: [
                        {
                            urlPattern: /version\.json/,
                            handler: "NetworkOnly",
                        },
                    ],
                },
            },
        },
        {
            resolve: "gatsby-plugin-robots-txt",
            options: {
                host: siteUrl,
                sitemap: `${siteUrl}/sitemap-index.xml`,
                policy: [{ userAgent: "*", disallow: require("./src/robots") }],
            },
        },
        {
            resolve: "gatsby-plugin-sitemap",
        },
        {
            resolve: "gatsby-source-filesystem",
            options: {
                name: "news",
                path: `${__dirname}/cms/news`,
            },
        },
        "gatsby-transformer-remark",
    ],
};
export default config;
