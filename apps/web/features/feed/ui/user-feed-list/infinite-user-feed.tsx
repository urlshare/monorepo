"use client";

import { InfiniteData } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import qs from "qs";
import { FC } from "react";

import { InfiniteFeedList } from "./infinite-feed-list";
import { User } from "@supabase/supabase-js";
import { feedSourceSchema } from "../../shared/feed-source";
import { LoadingFeed } from "../loading-feed";
import { ErrorLoadingFeed } from "../error-loading-feed";
import { FeedVM } from "../../models/feed.vm";
import { GetUserFeedResponse } from "../../router/procedures/get-user-feed";
import { api } from "@/trpc/react";

const aggregateFeeds = (data?: InfiniteData<GetUserFeedResponse>) => {
  if (!data) {
    return [];
  }

  return data.pages.reduce((acc, page) => {
    return acc.concat(page.feed);
  }, [] as FeedVM[]);
};

const getNextCursor = (data?: InfiniteData<GetUserFeedResponse>) => {
  return data?.pages[data?.pages.length - 1]?.nextCursor;
};

type InfiniteUserFeedProps = {
  from?: FeedVM["createdAt"];
  userId: User["id"];
  viewerId?: User["id"];
};

export const InfiniteUserFeed: FC<InfiniteUserFeedProps> = ({ userId, from, viewerId }) => {
  const searchParams = useSearchParams();
  const categoriesString = qs.parse(searchParams.toString()).categories;
  const categoryIdsInSearchParams = typeof categoriesString === "string" ? categoriesString.split(",") : [];
  const source = feedSourceSchema.parse(searchParams.get("source"));
  const initialCursor = from ? new Date(from) : undefined;

  const { data, isLoading, isError, fetchNextPage, isFetchingNextPage } = api.feeds.getUserFeed.useInfiniteQuery(
    {
      userId,
      feedSource: source,
      categoryIds: categoryIdsInSearchParams,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      initialCursor,
    },
  );

  if (isLoading) {
    return <LoadingFeed />;
  }

  if (isError) {
    return <ErrorLoadingFeed />;
  }

  const feed = aggregateFeeds(data);
  const shouldLoadMore = Boolean(getNextCursor(data));

  console.log({ feed });

  if (feed.length === 0) {
    return (
      <div className="rounded rounded-xl bg-gray-50 p-10">
        <h2 className="text-md font-bold">No URLs yet. Add some!</h2>
      </div>
    );
  }

  return (
    <InfiniteFeedList
      feed={feed}
      loadMore={fetchNextPage}
      shouldLoadMore={shouldLoadMore}
      isFetching={isFetchingNextPage}
      viewerId={viewerId}
    />
  );
};
