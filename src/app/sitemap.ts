import type { MetadataRoute } from "next";
import { getAllCommandSlugs, getCategoryCounts } from "@/lib/content/loader";
import { getAllConceptSlugs } from "@/lib/content/concept-loader";
import { LEARN_TRACKS } from "@/lib/learn-tracks";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/catalogue`, changeFrequency: "weekly", priority: 0.9 },
    {
      url: `${SITE_URL}/catalogue/graph`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    { url: `${SITE_URL}/concepts`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/learn`, changeFrequency: "weekly", priority: 0.8 },
    {
      url: `${SITE_URL}/shortcuts`,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/playground`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  const commandRoutes: MetadataRoute.Sitemap = getAllCommandSlugs().map(
    (slug) => ({
      url: `${SITE_URL}/command/${slug}`,
      changeFrequency: "monthly",
      priority: 0.8,
    }),
  );

  const conceptRoutes: MetadataRoute.Sitemap = getAllConceptSlugs().map(
    (slug) => ({
      url: `${SITE_URL}/concepts/${slug}`,
      changeFrequency: "monthly",
      priority: 0.8,
    }),
  );

  const categoryRoutes: MetadataRoute.Sitemap = getCategoryCounts().map(
    ({ category }) => ({
      url: `${SITE_URL}/catalogue/${category}`,
      changeFrequency: "weekly",
      priority: 0.6,
    }),
  );

  const trackRoutes: MetadataRoute.Sitemap = LEARN_TRACKS.map((track) => ({
    url: `${SITE_URL}/learn/${track.slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [
    ...staticRoutes,
    ...commandRoutes,
    ...conceptRoutes,
    ...categoryRoutes,
    ...trackRoutes,
  ];
}
