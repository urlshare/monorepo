CREATE TABLE "urlshare_feeds" (
	"id" char(27) PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"user_url_id" char(30) NOT NULL,
	"liked" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "urlshare_feeds" ADD CONSTRAINT "urlshare_feeds_user_id_urlshare_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."urlshare_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "urlshare_feeds" ADD CONSTRAINT "urlshare_feeds_user_url_id_urlshare_users_urls_id_fk" FOREIGN KEY ("user_url_id") REFERENCES "public"."urlshare_users_urls"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "urlshare_feeds_user_id_index" ON "urlshare_feeds" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "urlshare_feeds_user_url_id_index" ON "urlshare_feeds" USING btree ("user_url_id");