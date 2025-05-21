import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const positionSchema = z.tuple([z.number(), z.number()]);

const buildingsSchema = z.object({
  id: z.number().or(z.string()),
  name: z.string(),
  name_en: z.string(),
  address: z.string().optional(),
  latitude: z.number(),
  longitude: z.number(),
  geometry: z
    .object({
      type: z.string(),
      coordinates: z.array(z.array(positionSchema)),
    })
    .optional(),
});

const buildings = defineCollection({
  loader: glob({ pattern: ["[^_]*.json"], base: "src/data/buildings" }),
  schema: z.array(buildingsSchema),
});

export const collections = { buildings };
export type BuildingProps = z.infer<typeof buildingsSchema>;
