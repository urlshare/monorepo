CREATE TABLE "urlshare_feed_interactions" (
	"id" char(31) PRIMARY KEY NOT NULL,
	"feed_id" char(27) NOT NULL,
	"user_id" uuid NOT NULL,
	"liked" boolean DEFAULT false NOT NULL,
	CONSTRAINT "urlshare_feed_interactions_feed_id_user_id_unique" UNIQUE("feed_id","user_id")
);
--> statement-breakpoint
ALTER TABLE "urlshare_feed_interactions" ADD CONSTRAINT "urlshare_feed_interactions_feed_id_urlshare_feeds_id_fk" FOREIGN KEY ("feed_id") REFERENCES "public"."urlshare_feeds"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "urlshare_feed_interactions" ADD CONSTRAINT "urlshare_feed_interactions_user_id_urlshare_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."urlshare_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "urlshare_feed_interactions_feed_id_index" ON "urlshare_feed_interactions" USING btree ("feed_id");--> statement-breakpoint
CREATE INDEX "urlshare_feed_interactions_user_id_index" ON "urlshare_feed_interactions" USING btree ("user_id");--> statement-breakpoint
ALTER TABLE "urlshare_feeds" DROP COLUMN "liked";