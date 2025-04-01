"use strict";

import { promises as fs } from "fs";
import path from "path";
import { languagesAvailable } from "../constants/langs";
import restore from "../i18n/.keep/restore.en.json";
import en from "../i18n/messages/en.json";
import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const ENV_SCHEMA = z.object({
  OPEN_AI_API_KEY: z.string(),
  OPEN_AI_ORGANIZATION: z.string(),
  OPEN_AI_PROJECT: z.string(),
});

const env = ENV_SCHEMA.parse(process.env);

const translate = async (params: {
  text: string;
  to: string;
  from: string;
  key: string;
}) => {
  const data = JSON.stringify({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: `You are a translator. I'll give you sentences that you have to translate into the lang I submit.

        For example, if I give you from: fr, to: en, you have to translate from french to english.
        
        The translation is for an Spotify app like app. I'll give you the key of the translation so use it for context.

        The chinese name of Zenless Zone Zero is 无畏契约.

        The japanese name of Zenless Zone Zero is ゼンレスゾーンゼロ.

        The korean name of Zenless Zone Zero is 젠레스 존 제로.

        Do not translate words inside {}.

        Give me only the translation.`,
      },
      {
        role: "user",
        content: `from:${params.from}, to:${params.to}, key:${params.key}
        
        ${params.text}`,
      },
    ],
    temperature: 0,
  });

  const config: RequestInit = {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.OPEN_AI_API_KEY}`,
      "OpenAI-Organization": env.OPEN_AI_ORGANIZATION,
      "OpenAI-Project": env.OPEN_AI_PROJECT,
    },
    body: data,
  };

  const response = await fetch(
    "https://api.openai.com/v1/chat/completions",
    config
  );

  const json = (await response.json()) as {
    choices: [{ message: { content: string } }];
  };

  return json.choices.map(({ message }) => message.content).join("");
};

async function storeFile(json: Record<string, string>, lang: string) {
  const dir = path.resolve("src/i18n/messages/", `${lang}.json`);
  await fs.writeFile(dir, JSON.stringify(json), "utf-8");
}

async function compareNewKeys() {
  const keysThatHaveBeenCreated = Object.keys(en).filter(
    (key) => !(key in restore)
  );

  const keysThatHaveBeenDeleted = Object.keys(restore).filter(
    (key) => !(key in en)
  );

  const keysThatHaveBeenModified = Object.keys(en).filter((key) => {
    const valueInEnglish = en[key as keyof typeof en];
    const valueInRestored = restore[key as keyof typeof restore];

    if (valueInEnglish && valueInRestored) {
      return valueInEnglish !== valueInRestored;
    }

    return false;
  });

  return {
    created: keysThatHaveBeenCreated.map((key) => ({
      key,
      value: en[key as keyof typeof en],
      lang: "en",
    })),
    modified: keysThatHaveBeenModified.map((key) => ({
      key,
      value: en[key as keyof typeof en],
      lang: "en",
    })),
    deleted: keysThatHaveBeenDeleted,
  };
}

async function loadFile(lang: string) {
  return JSON.parse(
    await fs.readFile(`src/i18n/messages/${lang}.json`, "utf-8")
  ) as Record<string, string>;
}

async function removeRemovedKeys(removedKeys: string[], lang: string) {
  console.log(`Removing keys: ${removedKeys.join(", ")} from ${lang}`);

  const file = await loadFile(lang);

  const keysFromFile = Object.keys(file);
  const newFile: Record<string, string> = {};

  keysFromFile.forEach((key) => {
    if (!removedKeys.includes(key)) {
      newFile[key] = file[key];
    }
  });

  await storeFile(newFile, lang);
}

async function addCreatedKeys(
  createdKeys: Array<{ key: string; value: string; lang: string }>,
  lang: string
) {
  console.log(
    `Adding keys: ${createdKeys.map((k) => k.key).join(", ")} to ${lang}`
  );
  const imported = await loadFile(lang);

  const file = { ...imported };

  for (const key of createdKeys) {
    file[`${key.key}`] = await translate({
      text: key.value,
      to: lang,
      from: key.lang,
      key: key.key,
    });
  }

  await storeFile(file, lang);
}

async function updateModifiedKeys(
  modifiedKeys: Array<{ key: string; value: string; lang: string }>,
  lang: string
) {
  console.log(
    `Updating keys: ${modifiedKeys.map((k) => k.key).join(", ")} in ${lang}`
  );

  const imported = await loadFile(lang);

  const file = { ...imported };

  for (const key of modifiedKeys) {
    file[`${key.key}`] = await translate({
      text: key.value,
      to: lang,
      from: key.lang,
      key: key.key,
    });
  }

  await storeFile(file, lang);
}

async function storeRestoreFile() {
  const file = await loadFile("en");

  const dir = path.resolve("src/i18n/.keep/restore.en.json");
  await fs.writeFile(dir, JSON.stringify(file), "utf-8");
}

async function main() {
  const { created, deleted, modified } = await compareNewKeys();

  for (const lang of languagesAvailable.filter((lang) => lang.id !== "en")) {
    if (deleted.length > 0) {
      await removeRemovedKeys(deleted, lang.id);
    } else {
      console.log(`No keys to remove`);
    }

    if (created.length > 0) {
      await addCreatedKeys(created, lang.id);
    } else {
      console.log(`No keys to add`);
    }

    if (modified.length > 0) {
      await updateModifiedKeys(modified, lang.id);
    } else {
      console.log(`No keys to update`);
    }
  }

  await storeRestoreFile();
}

async function getAllKeys() {
  const en = await loadFile("en");

  return Object.keys(en).map((key) => ({
    key,
    value: en[key as keyof typeof en],
    lang: "en",
  }));
}

async function addNewLanguage(lang: string) {
  const allKeys = await getAllKeys();

  await addCreatedKeys(allKeys, lang);
}

main();
