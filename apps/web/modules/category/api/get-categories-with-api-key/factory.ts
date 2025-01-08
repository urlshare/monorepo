import { db } from "@workspace/db/db";
import { generateRequestId } from "@workspace/request/id/generate-request-id";
import { Logger } from "@workspace/logger/logger";
import { StatusCodes } from "http-status-codes";

import { GetCategoriesWithApiKeyHandler } from "./index";
import { apiKeySchema } from "@workspace/user/api-key/api-key.schema";

interface Params {
  logger: Logger;
}

type GetCategoriesWithApiKeyFactory = ({ logger }: Params) => GetCategoriesWithApiKeyHandler;

const actionType = "getUrlsWithApiKeyHandler";

export const getCategoriesWithApiKeyFactory: GetCategoriesWithApiKeyFactory =
  ({ logger }) =>
  async (req, res) => {
    const requestId = generateRequestId();
    logger.info({ requestId, actionType }, "Getting categories with ApiKey initiated.");

    const apiKeyResult = apiKeySchema.safeParse(req.query.apiKey);

    if (!apiKeyResult.success) {
      logger.error({ requestId, actionType }, "Invalid ApiKey provided.");

      res.status(StatusCodes.FORBIDDEN);
      res.json({ error: "Invalid ApiKey provided." });
      return;
    }

    const apiKey = apiKeyResult.data;
    const maybeUser = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.apiKey, apiKey),
    });

    if (!maybeUser) {
      logger.error({ requestId, actionType }, "User identified by ApiKey not found.");

      res.status(StatusCodes.FORBIDDEN);
      res.json({ error: "Invalid ApiKey provided." });
      return;
    }

    const userId = maybeUser.id;
    const categories = await await db.query.categories.findMany({
      columns: {
        id: true,
        name: true,
        urlsCount: true,
      },
      where: (categories, { eq }) => eq(categories.userId, userId),
      orderBy: (categories, { asc }) => [asc(categories.name)],
    });

    logger.info({ requestId, actionType, categories }, "Categories fetched.");

    res.status(StatusCodes.OK);
    res.json({ categories });
  };
