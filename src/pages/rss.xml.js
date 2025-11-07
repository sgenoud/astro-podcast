import rss from "@astrojs/rss";
import { getCollection } from "astro:content";

import { CONSTANTS } from "../constants";

import sanitizeHtml from "sanitize-html";
import MarkdownIt from "markdown-it";

const parser = new MarkdownIt();

export async function GET(context) {
  const { site } = context;
  const {
    title,
    language,
    description,
    author,
    categories = [],
    podcastImage,
    ownerEmail,
    ownerName,
    explicit,
  } = CONSTANTS;

  const custom = [
    `<itunes:explicit>${explicit ? "yes" : "false"}</itunes:explicit>`,
  ];

  if (language) custom.push(`<language>${language}</language>`);
  if (author) custom.push(`<itunes:author>${author}</itunes:author>`);
  if (podcastImage) {
    const img = new URL(podcastImage, site).href;
    custom.push(`<itunes:image href="${img}" />`);
  }
  if (categories.length)
    custom.push(...categories.map((c) => `<itunes:category text="${c}"/>`));
  if (ownerName || ownerEmail) {
    const ownerInfo = [];
    if (ownerName) ownerInfo.push(`<itunes:name>${ownerName}</itunes:name>`);
    if (ownerEmail)
      ownerInfo.push(`<itunes:email>${ownerEmail}</itunes:email>`);
    custom.push(`<itunes:owner>${ownerInfo.join("")}</itunes:owner>`);
  }

  const episodes = await getCollection("episodes");
  return rss({
    title,
    description,
    site: site,
    xmlns: {
      itunes: "http://www.itunes.com/dtds/podcast-1.0.dtd",
    },
    customData: custom.join("\n"),

    items: episodes.map((episode) => {
      const {
        title,
        summary,
        date,
        duration,

        audio_url,
        audio_length,
        audio_type,
        explicit,
      } = episode.data;

      const content = sanitizeHtml(parser.render(episode.body));

      return {
        title,
        pubDate: date,
        description: summary,
        link: `/episodes/${episode.id}/`,
        content: content,

        enclosure: {
          url: audio_url,
          length: audio_length,
          type: audio_type,
        },

        customData: [
          `<itunes:author>${author}</itunes:author>`,
          `<itunes:title>${title}</itunes:title>`,
          `<itunes:duration>${duration}</itunes:duration>`,
          `<itunes:explicit>${explicit ? "yes" : "false"}</itunes:explicit>`,
        ].join("\n"),
      };
    }),
  });
}
