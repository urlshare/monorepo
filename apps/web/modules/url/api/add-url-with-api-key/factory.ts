import { sha1 } from "@workspace/crypto/sha1";
import { db, orm, schema } from "@workspace/db/db";
import { Logger } from "@workspace/logger/logger";
import { StatusCodes } from "http-status-codes";

import { addUrlWithApiKeyHandlerBodyPayloadSchema } from "./body-payload.schema";
import { AddUrlWithApiKeyHandler } from "./index";
import { apiKeySchema } from "@workspace/user/api-key/api-key.schema";
import { generateRequestId } from "@workspace/request/id/generate-request-id";
import { fetchMetadata } from "@workspace/metadata/fetch-metadata";
import { compressMetadata } from "@workspace/metadata/compression";

interface Params {
  logger: Logger;
}

type AddUrlWithApiKeyFactory = ({ logger }: Params) => AddUrlWithApiKeyHandler;

const actionType = "addUrlWithApiKeyHandler";

export const addUrlWithApiKeyFactory: AddUrlWithApiKeyFactory =
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
    const bodyResult = addUrlWithApiKeyHandlerBodyPayloadSchema.safeParse(req.body);

    if (!bodyResult.success) {
      logger.error({ requestId, actionType }, "Body validation error.");

      res.status(StatusCodes.NOT_ACCEPTABLE);
      return;
    }

    const { url, categoryIds } = bodyResult.data;
    const urlHash = sha1(url);

    // Check if there's a record for this hash
    const maybeUrl = await db.query.urls.findFirst({
      where: (urls, { eq }) => eq(urls.urlHash, urlHash),
    });

    try {
      // If there's one, attempt creating a userUrl entry
      if (maybeUrl) {
        // TODO: Perhaps IDEA#4

        await db.insert(schema.usersUrls).values({ userId, urlId: maybeUrl.id });

        logger.info({ requestId, actionType, url }, "URL exists, added to user.");

        res.status(StatusCodes.CREATED);
        res.send({ success: true });

        return;
      }

      const metadata = await fetchMetadata(url);

      // If there isn't one
      // TODO: IDEA#5

      // TODO: IMPORTANT - replace with queue ASAP
      // Get or create Url
      const urlToAdd = metadata.url || url;
      const urlToAddHash = sha1(urlToAdd);
      const compressedMetadata = compressMetadata(metadata);

      let maybeUrlEntry = await db.query.urls.findFirst({
        where: (urls, { eq }) => eq(urls.urlHash, urlToAddHash),
      });

      if (!maybeUrlEntry) {
        const result = await db
          .insert(schema.urls)
          .values({
            url: urlToAdd,
            urlHash: urlToAddHash,
            metadata: compressedMetadata,
          })
          .returning();

        maybeUrlEntry = result[0];
      }

      if (!maybeUrlEntry) {
        throw new Error("Failed to create URL entry.");
      }

      const urlId = maybeUrlEntry.id;

      await db.transaction(async (tx) => {
        const [userUrl] = await tx.insert(schema.usersUrls).values({ userId, urlId }).returning();

        if (!userUrl) {
          throw new Error("Failed to create userUrl entry.");
        }

        if (categoryIds.length > 0) {
          const dataToAdd = categoryIds.map((categoryId) => ({
            categoryId,
            userUrlId: userUrl.id,
          }));

          await tx.insert(schema.userUrlsCategories).values(dataToAdd);
          await tx
            .update(schema.categories)
            .set({
              urlsCount: orm.sql`${schema.categories.urlsCount} + 1`,
            })
            .where(orm.inArray(schema.categories.id, categoryIds));

          await tx
            .update(schema.userProfiles)
            .set({ urlsCount: orm.sql`${schema.userProfiles.urlsCount} + 1` })
            .where(orm.eq(schema.userProfiles.userId, userId));
        }
      });

      // await prisma.urlQueue.create({
      //   data: {
      //     id: ID_PLACEHOLDER_REPLACED_BY_ID_GENERATOR,
      //     rawUrl: url,
      //     rawUrlHash: urlHash,
      //     userId,
      //     categoryIds,
      //   },
      // });

      logger.info({ requestId, actionType, url }, "URL added to queue.");

      res.status(StatusCodes.CREATED);
      res.json({ success: true });
    } catch (error) {
      logger.error({ requestId, actionType, error }, "Failed to store the URL.");

      res.status(StatusCodes.INTERNAL_SERVER_ERROR);
      res.json({ error: "Failed to add the URL, try again." });
    }
  };
