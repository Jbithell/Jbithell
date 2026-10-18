/**
 * Connects EmDash's database-backed content to Astro. Query it with getEmDashCollection() and getEmDashEntry()
 */
import { defineLiveCollection } from "astro:content";
import { emdashLoader } from "emdash/runtime";

export const collections = {
  _emdash: defineLiveCollection({ loader: emdashLoader() }),
};
