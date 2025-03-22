import { schema } from "@workspace/db/db";

export type CategoryVM = Pick<schema.Category, "id" | "name" | "urlsCount">;
