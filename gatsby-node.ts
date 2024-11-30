import fs from "fs-extra";
import { BuildArgs, CreatePagesArgs } from "gatsby";
import { globSync } from "glob";
import path from "path";
import sharp from "sharp";
import EventsPortfolio from "./eventPortfolio.json";
import { EventPortolioObject } from "./src/types";

export const createPages = async function ({
  actions,
  graphql,
  reporter,
}: CreatePagesArgs) {
  reporter.info(`Generating live events portfolio`);
  EventsPortfolio.forEach((event: EventPortolioObject) => {
    reporter.info(`Creating page for ${event.name}`);
    actions.createPage({
      path: "/events/" + event.slug,
      component: path.resolve(`./src/components/templates/EventPage.tsx`),
      context: { event },
      defer: false,
    });
  });
  reporter.success(`Completed generating live events portfolio`);
  reporter.info(`Generating live events portfolio listing page`);
  actions.createPage({
    path: "/events/",
    component: path.resolve(`./src/components/templates/EventsPage.tsx`),
    context: {
      events: EventsPortfolio as EventPortolioObject[],
    },
    defer: false,
  });
  reporter.success(`Generated live events portfolio listing page`);
};

const optimiseImage = async function (sourcePath: string, outputPath: string) {
  const MAX_WIDTH = 1920;
  const QUALITY = 70;
  const stream = sharp(sourcePath);
  const info = await stream.metadata();

  if (info.width && info.width < MAX_WIDTH) {
    return;
  }

  await stream.resize(MAX_WIDTH).jpeg({ quality: QUALITY }).toFile(outputPath);
};

export const onPreInit = async function ({ reporter }: BuildArgs) {
  reporter.info(`Generating optimised images`);
  const sourceDir = path.join(__dirname, "src/images");
  const staticDir = path.join(__dirname, "static/images/compressed");
  const matches = globSync(sourceDir + "/**/*.{png,jpg,jpeg}");
  const MAX_WIDTH = 1920;
  const QUALITY = 70;
  const conversions = [];
  for (const match of matches) {
    // Create the directories first syncronosly to avoid race condition
    const optimizedName = match.replace(/(\..+)$/, (match, ext) => `${ext}`);
    const optimizedPath = optimizedName.replace(sourceDir, staticDir);
    if (!fs.existsSync(path.dirname(optimizedPath))) {
      fs.mkdirSync(path.dirname(optimizedPath), { recursive: true });
    }
    conversions.push([match, optimizedPath]);
  }
  await Promise.all(
    conversions.map(([sourcePath, outputPath]) => {
      reporter.info(
        `Optimising image: ${sourcePath} to be placed at ${outputPath}`
      );
      return optimiseImage(sourcePath, outputPath);
    })
  );
  reporter.success(`Successfully optimised all images`);
};
