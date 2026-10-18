import handler, { createScheduledHandler, PluginBridge } from "@emdash-cms/cloudflare/worker";

export { PluginBridge };

export default {
  ...handler,
  // Runs scheduled publishing and maintenance from the Cron Trigger in wrangler.jsonc
  scheduled: createScheduledHandler(),
} satisfies ExportedHandler;
