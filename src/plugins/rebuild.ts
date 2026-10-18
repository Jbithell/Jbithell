import { definePlugin, type PluginContext, type RouteContext } from "emdash";

/**
 * The public site is prerendered, so it only changes when Workers Builds rebuilds and deploys it.
 * This starts a build through a Deploy Hook whenever content is published, unpublished or deleted,
 * and adds a dashboard widget to rebuild by hand, for changes such as site settings that have no hook.
 *
 * The hook URL is read from the DEPLOY_HOOK_URL secret. Workers Builds doesn't queue a second build
 * while one is still starting, so publishing several entries in a row only builds once or twice.
 */
const WIDGET = "rebuild";
const LAST_BUILD = "lastBuild";

interface LastBuild {
  at: string;
  reason: string;
  ok: boolean;
  error?: string;
}

async function deployHookUrl(): Promise<string | undefined> {
  // Imported lazily, as EmDash also loads plugins in Node when building
  const { env } = await import("cloudflare:workers");
  const url = (env as { DEPLOY_HOOK_URL?: string }).DEPLOY_HOOK_URL;
  return url || undefined;
}

async function rebuild(ctx: PluginContext, reason: string): Promise<LastBuild> {
  const url = await deployHookUrl();
  const build: LastBuild = { at: new Date().toISOString(), reason, ok: false };
  if (!url) {
    build.error = "DEPLOY_HOOK_URL isn't set";
  } else {
    try {
      const response = await ctx.http!.fetch(url, { method: "POST" });
      build.ok = response.ok;
      if (!response.ok) build.error = `HTTP ${response.status}`;
    } catch (error) {
      build.error = error instanceof Error ? error.message : String(error);
    }
  }
  if (build.ok) ctx.log.info(`Started a site rebuild: ${reason}`);
  else ctx.log.error(`Failed to start a site rebuild: ${build.error}`);
  await ctx.kv.set(LAST_BUILD, build);
  return build;
}

async function widget(ctx: PluginContext) {
  const [url, last] = await Promise.all([deployHookUrl(), ctx.kv.get<LastBuild>(LAST_BUILD)]);
  return {
    blocks: [
      ...(url
        ? []
        : [
            {
              type: "banner",
              variant: "error",
              title: "Rebuilds are off",
              description: "Set the DEPLOY_HOOK_URL secret to rebuild the site after publishing.",
            },
          ]),
      {
        type: "context",
        text: "The site rebuilds a minute or two after you publish. Rebuild it by hand after changing Settings.",
      },
      ...(last
        ? [
            {
              type: "fields",
              fields: [
                { label: "Last rebuild", value: new Date(last.at).toLocaleString("en-GB") },
                { label: "Reason", value: last.reason },
                { label: "Status", value: last.ok ? "Started" : `Failed: ${last.error}` },
              ],
            },
          ]
        : []),
      {
        type: "actions",
        elements: [{ type: "button", action_id: "rebuild", label: "Rebuild site", style: "primary" }],
      },
    ],
  };
}

const widgets = [{ id: WIDGET, title: "Website", size: "third" as const }];

export function createPlugin() {
  return definePlugin({
    id: "rebuild",
    version: "1.0.0",
    capabilities: ["content:read", "network:request"],
    allowedHosts: ["api.cloudflare.com"],
    hooks: {
      "content:afterPublish": async (event, ctx) => {
        await rebuild(ctx, `Published ${event.collection} ${String(event.content.slug ?? "")}`.trim());
      },
      "content:afterUnpublish": async (event, ctx) => {
        await rebuild(ctx, `Unpublished ${event.collection} ${String(event.content.slug ?? "")}`.trim());
      },
      "content:afterDelete": async (event, ctx) => {
        await rebuild(ctx, `Deleted ${event.collection}`);
      },
    },
    routes: {
      admin: {
        handler: async (ctx: RouteContext<{ type?: string; page?: string; action_id?: string }>) => {
          const { type, page, action_id } = ctx.input ?? {};
          if (type === "block_action" && action_id === "rebuild") {
            const build = await rebuild(ctx, `Requested by ${ctx.user?.name || ctx.user?.email || "an editor"}`);
            return {
              ...(await widget(ctx)),
              toast: build.ok
                ? { message: "Rebuilding the site", type: "success" }
                : { message: `Couldn't start a rebuild: ${build.error}`, type: "error" },
            };
          }
          if (type === "page_load" && page === `widget:${WIDGET}`) return widget(ctx);
          return { blocks: [] };
        },
      },
    },
    admin: { widgets },
  });
}
