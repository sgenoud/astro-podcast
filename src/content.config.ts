import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders"; // Not available with legacy API

const episodes = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/episodes" }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    summary: z.string(),
    duration: z.string(),
    audio_url: z.string(),
    audio_type: z.string().default("audio/mpeg"),
    audio_length: z.number(),
  }),
});

export const collections = { episodes };
