import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Calendar, Image as ImageIcon, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { FC, ReactNode } from "react";

import { LogoIcon } from "@/components/logo";

import { UserImage } from "../../../user/ui/user-image";
import { FeedVM } from "../../models/feed.vm";

type FeedListItemProps = {
  feedItem: FeedVM;
  interactions: ReactNode;
  optionsDropdown?: ReactNode;
};

// TODO: move to some shared constants
const WEB_APP_DOMAIN = "urlshare.app";

export const FeedListItem: FC<FeedListItemProps> = ({ feedItem, interactions, optionsDropdown }) => {
  const { url, createdAt, user } = feedItem;

  // TODO: Implement isImage and isWebsite functions
  const isAnImage = false; //isImage(url.metadata);
  const isAWebsite = true; //isWebsite(url.metadata.data);
  const isSomethingElse = !isAnImage && !isAWebsite;

  return (
    <Card className="overflow-hidden rounded-sm shadow hover:shadow-lg">
      <CardHeader className="relative cursor-pointer">
        <CardTitle className="flex items-center gap-3">
          {isAnImage && <ImageIcon strokeWidth={1} size={40} className="text-slate-400" aria-label="Image icon" />}
          {isAWebsite && (
            <Avatar className="h-9 w-9">
              <AvatarImage src={url.metadata.data.faviconUrl} alt={url.metadata.data.publisher} />
              <AvatarFallback />
            </Avatar>
          )}
          {isSomethingElse && (
            <LogoIcon strokeWidth={1} size={40} className="text-slate-400" aria-label={`${WEB_APP_DOMAIN} logo icon`} />
          )}
          <a
            href={url.url}
            title={url.metadata.data.title}
            target="_blank"
            className="overflow-hidden text-ellipsis leading-7 decoration-slate-200 group-hover:underline"
            rel="noreferrer"
          >
            {url.metadata.data.title || url.url}
          </a>
        </CardTitle>
        <span className="flex flex-row items-center gap-1 pl-12 text-xs text-slate-400">
          <Calendar size={13} />
          <span>{createdAt.toLocaleString()}</span>
        </span>
        {optionsDropdown ? (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-3 top-1 h-7 w-7 rounded text-slate-400 hover:text-slate-600"
            >
              <MoreHorizontal size={16} />
            </Button>
            {optionsDropdown}
          </>
        ) : null}
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        {url.metadata.data.imageUrl && (
          <figure>
            <a
              href={url.url}
              title={url.metadata.data.title}
              target="_blank"
              className="flex max-h-80 place-content-center overflow-hidden"
              rel="noreferrer"
            >
              <img src={url.metadata.data.imageUrl} alt={url.metadata.data.title} className="object-cover" />
            </a>
          </figure>
        )}
        <CardDescription>{url.metadata.data.description}</CardDescription>
      </CardContent>
      <CardFooter className="flex items-center justify-between gap-4">
        <div className="flex grow items-center gap-2">
          <div>{interactions}</div>
          <span className="text-xs font-light text-slate-400">{url.categoryNames.join(", ")}</span>
        </div>
        <Link href={`/${user.username}`} className="flex-none">
          <UserImage username={user.username} imageUrl={user.imageUrl} size="small" />
        </Link>
      </CardFooter>
    </Card>
  );
};
