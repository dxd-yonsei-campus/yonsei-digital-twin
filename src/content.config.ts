import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const positionSchema = z.tuple([z.number(), z.number()]);

const buildingsSchema = z.object({
  id: z.number().or(z.string()),
  name: z.string(),
  name_en: z.string(),
  address: z.string().optional(),
  latitude: z.number(),
  longitude: z.number(),
  height: z.number().optional(),
  geometry: z
    .object({
      type: z.string(),
      coordinates: z.array(z.array(positionSchema)),
    })
    .optional(),

  floor_level: z.number().optional(),
  approval_date: z.coerce.date().optional(),
  construction_type: z.string().optional(),
  construction_type_en: z.string().optional(),
  total_floor_area: z.number().optional(),
  total_building_area: z.number().optional(),
});

const buildings = defineCollection({
  loader: glob({ pattern: ['[^_]*.json'], base: 'src/data/buildings' }),
  schema: ({ image }) =>
    z.array(
      buildingsSchema.extend({
        images: z.array(image()).optional(),
      }),
    ),
});

export const collections = { buildings };
export type BuildingProps = z.infer<typeof buildingsSchema>;
