import { CategoryVM } from "@/features/category/models/category.vm";
import { UserProfile } from "@workspace/db/types";
import { FC } from "react";
import { UserFeedSourceSelector } from "./user-feed-source-selector";
import { CategoriesSelector } from "@/features/category/ui/categories-selector";

type FeedListFiltersProps = {
  username: UserProfile["username"];
  categories: ReadonlyArray<CategoryVM>;
};

export const FeedListFilters: FC<FeedListFiltersProps> = ({ username, categories }) => {
  return (
    <aside className="flex justify-between">
      <UserFeedSourceSelector author={username} />
      <CategoriesSelector author={username} categories={categories} />
    </aside>
  );
};
