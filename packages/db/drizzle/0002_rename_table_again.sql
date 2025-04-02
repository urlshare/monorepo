CREATE TABLE "urlshare_users_urls_interactions" (
	"user_url_id" char(30) NOT NULL,
	"user_id" uuid NOT NULL,
	"liked" boolean DEFAULT false NOT NULL,
	CONSTRAINT "urlshare_users_urls_interactions_user_url_id_user_id_pk" PRIMARY KEY("user_url_id","user_id")
);
--> statement-breakpoint
DROP TABLE "urlshare_user_url_interactions" CASCADE;--> statement-breakpoint
ALTER TABLE "urlshare_users_urls_interactions" ADD CONSTRAINT "urlshare_users_urls_interactions_user_url_id_urlshare_feeds_id_fk" FOREIGN KEY ("user_url_id") REFERENCES "public"."urlshare_feeds"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "urlshare_users_urls_interactions" ADD CONSTRAINT "urlshare_users_urls_interactions_user_id_urlshare_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."urlshare_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "urlshare_users_urls_interactions_user_url_id_index" ON "urlshare_users_urls_interactions" USING btree ("user_url_id");--> statement-breakpoint
CREATE INDEX "urlshare_users_urls_interactions_user_id_index" ON "urlshare_users_urls_interactions" USING btree ("user_id");