CREATE TABLE "urlshare_url_hashes" (
	"compound_hash" char(64) PRIMARY KEY NOT NULL,
	"url_hash" char(40) NOT NULL,
	"count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "urlshare_url_hashes_compound_hash_url_hash_unique" UNIQUE("compound_hash","url_hash")
);
--> statement-breakpoint
CREATE TABLE "urlshare_url_hashes_compound_hashes_counts" (
	"url_hash" char(40) PRIMARY KEY NOT NULL,
	"compound_hashes_count" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
ALTER TABLE "urlshare_url_hashes" ADD CONSTRAINT "urlshare_url_hashes_compound_hash_urlshare_urls_compound_hash_fk" FOREIGN KEY ("compound_hash") REFERENCES "public"."urlshare_urls"("compound_hash") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "urlshare_url_hashes_url_hash_index" ON "urlshare_url_hashes" USING btree ("url_hash");