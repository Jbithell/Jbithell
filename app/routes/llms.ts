import eventPortfolio from "../../eventPortfolio.json";
import { SITE_URL } from "../seo";
import type { EventPortfolioObject } from "../types.d";

export async function loader() {
  const events = (eventPortfolio as EventPortfolioObject[])
    .slice()
    .reverse()
    .map(
      (event) =>
        `- [${event.name}](${SITE_URL}/events/${event.slug}): ${
          event.date
        } - ${event.roles.join(", ")}${event.venue ? ` at ${event.venue}` : ""}`
    )
    .join("\n");
  return new Response(
    `# James Bithell

> Personal website of James Bithell, based in London, United Kingdom, with contact details, CV and a portfolio of live events worked on since 2014.

- Email: hi@jbithell.com
- [Contact](${SITE_URL}/contact): Contact details
- [CV](https://www.linkedin.com/in/jbithell/): CV on LinkedIn
- [Development portfolio](https://github.com/jbithell): Software projects on GitHub
- [Sitemap](${SITE_URL}/sitemap.xml)

## Live events portfolio

[Event Portfolio](${SITE_URL}/events), most recent first:

${events}
`,
    { headers: { "Content-Type": "text/plain; charset=utf-8" } }
  );
}
