import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const positionSchema = z.tuple([z.number(), z.number()]);

const buildingsSchema = z.object({
  id: z.number(),
  name: z.string(),
  name_en: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  geometry: z.object({
    type: z.string(),
    coordinates: z.array(positionSchema),
  }),
});

const buildings = defineCollection({
  loader: glob({ pattern: ["[^_]*.json"], base: "src/data/buildings" }),
  schema: z.array(buildingsSchema),
});

export const collections = { buildings };
