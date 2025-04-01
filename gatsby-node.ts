import { GatsbyNode } from "gatsby";
import * as path from "path";
import * as fs from "fs";
import dotenv from "dotenv";
import { languagesAvailable } from "./src/constants/langs";
import { tracks } from "./src/database/tracks";
import * as git from "git-rev-sync";

dotenv.config();

const HomeTemplate = path.resolve(`src/templates/home.tsx`);

const getMessages = (lang: string) => {
  const filePath = path.join(__dirname, `src/i18n/messages/${lang}.json`);
  const messages = JSON.parse(fs.readFileSync(filePath, "utf8"));
  return messages;
};

const getMostPlayedSongsOfTheMonth = async (): Promise<
  { total: number; track_id: string }[]
> => {
  const response = await fetch("https://plausible.foudroyer.com/api/v2/query", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.PLAUSIBLE_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      site_id: process.env.PLAUSIBLE_SITE_ID,
      metrics: ["visitors"],
      date_range: "30d",
      filters: [["is", "event:goal", ["Playing"]]],
      dimensions: ["event:props:track_id"],
    }),
  });

  if (!response.ok) {
    console.error(`Plausible API error: ${response.statusText}`);
    return [];
  }

  const data = await response.json();

  return data.results.map((result: any) => ({
    total: result.metrics[0] as number,
    track_id: result.dimensions[0] as string,
  }));
};

export const createPages: GatsbyNode["createPages"] = async ({ actions }) => {
  const { createPage } = actions;

  const tracks_most_played_of_the_month_from_plausible =
    await getMostPlayedSongsOfTheMonth();

  const tracks_most_played_of_the_month =
    tracks_most_played_of_the_month_from_plausible.map((track) =>
      tracks.find((result) => result.title_id === track.track_id)
    );

  languagesAvailable.forEach((lang) => {
    createPage({
      path: lang.id === "en" ? "/" : `/${lang.id}/`,
      component: HomeTemplate,
      context: {
        lang: lang.id,
        messages: getMessages(lang.id),
        otherLangs: languagesAvailable.map((lang) => ({
          lang: lang.id,
          url: lang.id === "en" ? "/" : `/${lang.id}/`,
          isDefault: lang.id === "en",
        })),
        most_played_songs_of_the_month: tracks_most_played_of_the_month.slice(
          1,
          11
        ),
        git_version: git.short(),
      },
    });
  });
};

export const onCreateWebpackConfig: GatsbyNode["onCreateWebpackConfig"] = ({
  actions,
}) => {
  actions.setWebpackConfig({
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
  });
};

export const onPreBootstrap: GatsbyNode["onPreBootstrap"] = async () => {
  fs.writeFileSync(
    "./static/version.json",
    JSON.stringify(
      {
        version: git.short(),
        build_time: new Date().toISOString(),
      },
      null,
      2
    )
  );
};
