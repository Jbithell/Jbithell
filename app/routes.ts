import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  route("events/:eventSlug", "./routes/event.tsx"),
  route("events", "./routes/events.tsx"),
  route("contact", "./routes/contact.tsx"),
  index("routes/index.tsx"),
] satisfies RouteConfig;
