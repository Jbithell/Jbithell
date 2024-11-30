import fs from "fs-extra";
import { BuildArgs, CreatePagesArgs } from "gatsby";
import { globSync } from "glob";
import path from "path";
import sharp from "sharp";
import EventsPortfolio from "./src/portfolio/events.json";
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

export const onPreInit = async function ({ reporter }: BuildArgs) {
  reporter.info(`Generating optimised images`);
  const sourceDir = path.join(__dirname, "src/images");
  const staticDir = path.join(__dirname, "static/images");
  const matches = globSync(sourceDir + "/**/*.{png,jpg,jpeg}");
  const MAX_WIDTH = 1920;
  const QUALITY = 70;

  await Promise.all(
    matches.map(async (match) => {
      const stream = sharp(match);
      const info = await stream.metadata();

      if (info.width && info.width < MAX_WIDTH) {
        return;
      }

      const optimizedName = match.replace(
        /(\..+)$/,
        (match, ext) => `-min${ext}`
      );

      const optimizedPath = optimizedName.replace(sourceDir, staticDir);
      await stream
        .resize(MAX_WIDTH)
        .jpeg({ quality: QUALITY })
        .toFile(optimizedPath);
      reporter.success(`Optimised image ${match} to ${optimizedPath}`);
      return fs.rename(
        optimizedPath,
        path.join(staticDir, path.relative(__dirname, match))
      );
    })
  );
  reporter.success(`Successfully optimised all images`);
};
