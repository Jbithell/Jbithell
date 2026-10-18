import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  route("events/:eventSlug", "./routes/event.tsx"),
  route("events", "./routes/events.tsx"),
  route("contact", "./routes/contact.tsx"),
  route("sitemap.xml", "./routes/sitemap.ts"),
  route("llms.txt", "./routes/llms.ts"),
  index("routes/index.tsx"),
] satisfies RouteConfig;
