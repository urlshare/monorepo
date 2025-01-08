import { NextApiRequest, NextApiResponse } from "next";
import { logger } from "@workspace/logger/logger";

import { getCategoriesWithApiKeyFactory } from "./factory";
import { CategoryVM } from "../../models/category.vm";

type GetCategoriesWithApiKeySuccessResponse = { categories: CategoryVM[] };
type GetCategoriesWithApiKeyFailureResponse = { error: string };
export type GetCategoriesWithApiKeyResponse =
  | GetCategoriesWithApiKeySuccessResponse
  | GetCategoriesWithApiKeyFailureResponse;

export type GetCategoriesWithApiKeyHandler = (
  req: NextApiRequest,
  res: NextApiResponse<GetCategoriesWithApiKeyResponse>,
) => Promise<void>;

export const getCategoriesWithApiKeyHandler: GetCategoriesWithApiKeyHandler = getCategoriesWithApiKeyFactory({
  logger,
});
