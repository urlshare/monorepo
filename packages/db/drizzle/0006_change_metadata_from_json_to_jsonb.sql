ALTER TABLE "urlshare_urls" ALTER COLUMN "metadata" SET DATA TYPE jsonb;--> statement-breakpoint
ALTER TABLE "urlshare_urls" ALTER COLUMN "metadata" SET DEFAULT '{}'::jsonb;