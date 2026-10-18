import { EMAIL, LOCATION } from "./site";

/** Serialise JSON-LD for a <script> element, escaping anything that could close the element */
export const jsonLdScript = (data: object) =>
  JSON.stringify(data).replace(/</g, "\\u003c").replace(/>/g, "\\u003e").replace(/&/g, "\\u0026");

export function person({
  siteUrl,
  name,
  image,
  sameAs,
}: {
  siteUrl: string;
  name: string;
  image: string;
  sameAs: string[];
}) {
  return {
    "@type": "Person",
    "@id": `${siteUrl}/#person`,
    name,
    url: `${siteUrl}/`,
    image,
    email: `mailto:${EMAIL}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: LOCATION.locality,
      addressCountry: LOCATION.country,
    },
    sameAs,
  };
}
