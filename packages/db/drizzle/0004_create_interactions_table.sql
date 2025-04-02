CREATE TYPE "public"."interactionType" AS ENUM('LIKED');--> statement-breakpoint
CREATE TABLE "urlshare_users_urls_interactions" (
	"user_url_id" char(30) NOT NULL,
	"user_id" uuid NOT NULL,
	"interactionType" "interactionType" NOT NULL,
	CONSTRAINT "urlshare_users_urls_interactions_user_url_id_user_id_interactionType_pk" PRIMARY KEY("user_url_id","user_id","interactionType")
);
--> statement-breakpoint
ALTER TABLE "urlshare_users_urls_interactions" ADD CONSTRAINT "urlshare_users_urls_interactions_user_url_id_urlshare_feeds_id_fk" FOREIGN KEY ("user_url_id") REFERENCES "public"."urlshare_feeds"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "urlshare_users_urls_interactions" ADD CONSTRAINT "urlshare_users_urls_interactions_user_id_urlshare_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."urlshare_users"("id") ON DELETE cascade ON UPDATE no action;