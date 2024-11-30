import path from "path";
import { EventPortolioObject } from "./src/types";
import { BuildArgs, CreatePagesArgs } from "gatsby";
import EventsPortfolio from "./src/portfolio/events.json";
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

export const onPostBootstrap = function ({ reporter }: BuildArgs) {
  reporter.info(`Running on post bootstrap`);
};
