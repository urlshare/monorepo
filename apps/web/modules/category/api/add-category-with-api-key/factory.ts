import { Logger } from "@workspace/logger/logger";
import { generateRequestId } from "@workspace/request/id/generate-request-id";
import { StatusCodes } from "http-status-codes";
import { db, schema } from "@workspace/db/db";

import { addCategoryWithApiKeyHandlerBodyPayloadSchema } from "./body-payload.schema";
import { AddCategoryWithApiKeyHandler } from "./index";
import { apiKeySchema } from "@workspace/user/api-key/api-key.schema";

interface Params {
  logger: Logger;
}

type AddCategoryWithApiKeyFactory = ({ logger }: Params) => AddCategoryWithApiKeyHandler;

const actionType = "addCategoryWithApiKeyHandler";

export const addCategoryWithApiKeyFactory: AddCategoryWithApiKeyFactory =
  ({ logger }) =>
  async (req, res) => {
    const requestId = generateRequestId();
    logger.info({ requestId, actionType }, "Creating URL with ApiKey initiated.");

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

    const userId = maybeUser.userId;
    const bodyResult = addCategoryWithApiKeyHandlerBodyPayloadSchema.safeParse(req.body);

    if (!bodyResult.success) {
      logger.error({ requestId, actionType }, "Body validation error.");

      res.status(StatusCodes.NOT_ACCEPTABLE);
      return;
    }

    const { name } = bodyResult.data;

    const maybeCategory = await db.query.categories.findFirst({
      where: (categories, { and, eq }) => and(eq(categories.userId, userId), eq(categories.name, name)),
    });

    if (maybeCategory) {
      logger.error({ requestId, name }, `Category (${name}) exists.`);

      res.status(StatusCodes.BAD_REQUEST);
      res.json({ error: "Category name exists. Use different category name." });

      return;
    }

    try {
      await db.insert(schema.categories).values({ userId, name });

      logger.info({ requestId, name }, "Category created.");

      res.status(StatusCodes.CREATED);
      res.json({ success: true });
    } catch (error) {
      logger.error({ requestId, actionType, error }, "Failed to create the category.");

      res.status(StatusCodes.INTERNAL_SERVER_ERROR);
      res.json({ error: "Failed to create the category, try again." });
    }
  };
