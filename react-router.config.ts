import type { Config } from "@react-router/dev/config";
import { EventPortfolioObject } from "./app/types.d";
import eventPortfolio from "./eventPortfolio.json";
export default {
  ssr: true,
  future: {
    unstable_viteEnvironmentApi: true,
  },
  async prerender({ getStaticPaths }) {
    const events = eventPortfolio as EventPortfolioObject[];
    return [
      "/",
      "/contact",
      "/events",
      ...events.map((event) => `/events/${event.slug}`),
    ];
  },
} satisfies Config;

/*
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
*/
