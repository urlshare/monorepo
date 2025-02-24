ALTER TABLE "urlshare_urls" DROP CONSTRAINT "urlshare_urls_url_hash_unique";--> statement-breakpoint
ALTER TABLE "urlshare_urls" ADD COLUMN "compound_hash" char(64) NOT NULL;--> statement-breakpoint
ALTER TABLE "urlshare_urls" DROP COLUMN "url_hash";--> statement-breakpoint
ALTER TABLE "urlshare_urls" ADD CONSTRAINT "urlshare_urls_compound_hash_unique" UNIQUE("compound_hash");