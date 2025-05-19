import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const buildingsSchema = z.object({
  id: z.number(),
  name: z.string(),
  name_en: z.string(),
  latitude: z.number(),
  longitude: z.number(),
});

const buildings = defineCollection({
  loader: glob({ pattern: ["[^_]*.json"], base: "src/data/buildings" }),
  schema: z.array(buildingsSchema),
});

export const collections = { buildings };
