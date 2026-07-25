import { configureR2Cors, getR2Cors } from "./r2";

function printUsage() {
  console.log(
    [
      "Configure CORS on the Cloudflare R2 bucket for browser access",
      "",
      "Usage:",
      "  yarn catalog:configure-cors",
      "  yarn catalog:configure-cors --show",
      "",
      "Allows GET/HEAD from any origin (catalog JSON + MP3 streaming/download).",
    ].join("\n")
  );
}

async function main() {
  const args = new Set(process.argv.slice(2));

  if (args.has("--help") || args.has("-h")) {
    printUsage();
    return;
  }

  try {
    if (args.has("--show")) {
      const cors = await getR2Cors();
      console.log(JSON.stringify(cors.CORSRules, null, 2));
      return;
    }

    await configureR2Cors();
    console.log("R2 CORS configured successfully");

    const cors = await getR2Cors();
    console.log(JSON.stringify(cors.CORSRules, null, 2));
  } catch (error) {
    console.error("Error configuring R2 CORS:", error);
    process.exit(1);
  }
}

main();
