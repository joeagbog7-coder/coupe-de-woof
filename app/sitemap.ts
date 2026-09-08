import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://coupedewoof.fr",
      lastModified: new Date(),
    },
  ];
}