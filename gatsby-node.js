import "dotenv/config";
import * as path from "path";
import * as fs from "fs";
import { languagesAvailable } from "./src/constants/langs";
import characters from "./cms/ladders/characters.json";
import * as git from "git-rev-sync";
const HomeTemplate = path.resolve(`src/templates/home.tsx`);
const CharactersLadderTemplate = path.resolve(`src/templates/ladders/characters.tsx`);
const getMessages = (lang) => {
    const filePath = path.join(__dirname, `src/i18n/messages/${lang}.json`);
    const messages = JSON.parse(fs.readFileSync(filePath, "utf8"));
    return messages;
};
export const createPages = async ({ actions, graphql, }) => {
    const { createPage } = actions;
    const newsResult = await graphql(`
    query NewsPagesQuery {
      allMarkdownRemark(sort: { frontmatter: { published_at: DESC } }) {
        nodes {
          frontmatter {
            published_at
            title
            description
            language
            commit_id
          }
          rawMarkdownBody
        }
      }
    }
  `);
    if (newsResult.errors) {
        throw newsResult.errors[0];
    }
    const all_news = newsResult.data?.allMarkdownRemark.nodes ?? [];
    const en_news = all_news.filter((news) => news.frontmatter.language === "en");
    const build_time = new Date().toISOString();
    languagesAvailable.forEach((lang) => {
        const common_context = {
            lang: lang.id,
            messages: getMessages(lang.id),
            git_version: git.short(),
            build_time: build_time,
            news: en_news,
            otherLangs: languagesAvailable.map((lang) => ({
                lang: lang.id,
                url: lang.id === "en" ? "/" : `/${lang.id}/`,
                isDefault: lang.id === "en",
            })),
        };
        createPage({
            path: lang.id === "en" ? "/" : `/${lang.id}/`,
            component: HomeTemplate,
            context: {
                ...common_context,
            },
        });
        createPage({
            path: lang.id === "en"
                ? "/ladders/characters/"
                : `/${lang.id}/ladders/characters/`,
            component: CharactersLadderTemplate,
            context: {
                ladders: {
                    characters: characters,
                },
                ...common_context,
            },
        });
    });
};
export const onCreateWebpackConfig = ({ actions, }) => {
    actions.setWebpackConfig({
        resolve: {
            alias: {
                "@": path.resolve(__dirname, "src"),
            },
        },
    });
};
export const onPreBootstrap = async () => {
    fs.writeFileSync("./static/version.json", JSON.stringify({
        version: git.short(),
        build_time: new Date().toISOString(),
    }, null, 2));
};
