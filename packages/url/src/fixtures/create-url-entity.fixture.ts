import { sha1 } from "@workspace/crypto/sha1";
import { schema } from "@workspace/db/db";
import { compressMetadata } from "@workspace/metadata/compression";
import { type Metadata } from "@workspace/metadata/types";
import { generateUrlId } from "@workspace/url/id/generate-url-id";

const url = "https://example.url";

export const createUrlEntity = (overwrites: Partial<Omit<schema.Url, "urlHash" | "metadata">> = {}): schema.Url => ({
  id: generateUrlId(),
  createdAt: new Date(),
  updatedAt: new Date(),
  url,
  ...overwrites,
  urlHash: sha1(url),
  metadata: compressMetadata(createExampleWebsiteMetadata({ url })),
});

const createExampleWebsiteMetadata = (overwrites: Partial<Metadata> = {}): Metadata => ({
  audio: "Audio info",
  author: "Page Author",
  contentType: "text/html; charset=utf-8",
  copyright: "Copyright info",
  description: "Description",
  email: "email@gmail.com",
  facebook: "facebook.handle",
  icon: "https://icon.url",
  image: "https://image.url",
  keywords: ["keyword1", "keyword2"],
  language: "pl",
  modified: new Date().toISOString(),
  provider: "Provider info",
  published: new Date().toISOString(),
  robots: ["robots"],
  section: "Section info",
  title: "Page title",
  twitter: "https://twitter.com/user",
  type: "Type info",
  url: "https://the.url",
  video: "Video info",
  ...overwrites,
});
