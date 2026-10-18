import type { MetaDescriptor } from "react-router";
import { getImage } from "./images";

export const SITE_URL = "https://jbithell.com";
export const SITE_NAME = "James Bithell";

const profileImage = getImage("james-bithell-profile.jpg");

export const person = {
  "@type": "Person",
  "@id": `${SITE_URL}/#person`,
  name: SITE_NAME,
  url: SITE_URL,
  image: SITE_URL + profileImage.og,
  email: "mailto:hi@jbithell.com",
  address: {
    "@type": "PostalAddress",
    addressLocality: "London",
    addressCountry: "GB",
  },
  sameAs: [
    "https://www.linkedin.com/in/jbithell/",
    "https://github.com/jbithell",
  ],
};

export const breadcrumbs = (items: { name: string; path: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: item.name,
    item: SITE_URL + item.path,
  })),
});

/**
 * Title, description, canonical URL, Open Graph/Twitter tags and JSON-LD for a page
 */
export function pageMeta({
  title,
  description,
  path,
  image,
  imageAlt,
  jsonLd = [],
}: {
  title: string;
  description: string;
  path: string;
  image?: string; // Path to a JPEG, defaults to the profile photo
  imageAlt?: string;
  jsonLd?: object[];
}): MetaDescriptor[] {
  const url = SITE_URL + path;
  const largeImage = image !== undefined;
  return [
    { title },
    { name: "description", content: description },
    { tagName: "link", rel: "canonical", href: url },
    { property: "og:type", content: "website" },
    { property: "og:site_name", content: SITE_NAME },
    { property: "og:locale", content: "en_GB" },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: url },
    { property: "og:image", content: SITE_URL + (image ?? profileImage.og) },
    {
      property: "og:image:alt",
      content: imageAlt ?? "Profile photo of James Bithell smiling",
    },
    {
      name: "twitter:card",
      content: largeImage ? "summary_large_image" : "summary",
    },
    ...jsonLd.map((data) => ({ "script:ld+json": data })),
  ];
}
