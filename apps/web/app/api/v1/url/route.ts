import { generateRequestId } from "@workspace/request/id/generate-request-id";
import { StatusCodes } from "http-status-codes";
import { getUserIdFromRequest } from "@/lib/get-user-id-from-request";
import { cors, CorsOptions } from "@/lib/cors";
import { logger } from "@workspace/logger/logger";
import { addUrl } from "@/modules/url/api/v1/add-url";
import { addUrlRequestBodySchema } from "@/modules/url/api/v1/add-url/request-body.schema";
import { UserUrl } from "@workspace/db/types";

const corsOptions: CorsOptions = {
  methods: ["GET", "POST", "OPTIONS"],
  optionsSuccessStatus: StatusCodes.NO_CONTENT,
};

const ADD_URL_ACTION = "v1.url.addUrl";

type AddUrlSuccessResponse = { userUrl: UserUrl };
type AddUrlFailureResponse = { error: string };
export type AddUrlResponse = AddUrlSuccessResponse | AddUrlFailureResponse;

export async function POST(request: Request) {
  const requestId = generateRequestId();
  let response: Response;

  logger.info({ requestId, actionType: ADD_URL_ACTION }, "Adding url.");

  const userId = await getUserIdFromRequest(request, requestId, ADD_URL_ACTION);

  if (!userId) {
    return new Response("User not authorized.", { status: StatusCodes.FORBIDDEN });
  }

  const bodyResult = addUrlRequestBodySchema.safeParse(await request.json());

  if (!bodyResult.success) {
    logger.error({ requestId, actionType: ADD_URL_ACTION }, "Body validation error.");

    response = new Response("Invalid body.", { status: StatusCodes.NOT_ACCEPTABLE });
  } else {
    const data = bodyResult.data;
    let userUrl: UserUrl;

    console.log("data", data);

    try {
      userUrl = await addUrl({ categoryIds: data.categoryIds, metadata: data.metadata, userId });

      logger.info({ requestId, actionType: ADD_URL_ACTION, userUrl }, "URL added.");

      response = new Response(JSON.stringify({ userUrl }), { status: StatusCodes.CREATED });
    } catch (error) {
      logger.error({ requestId, actionType: ADD_URL_ACTION, error }, "Error adding URL.");

      response = new Response("Error adding URL.", { status: StatusCodes.INTERNAL_SERVER_ERROR });
    }
  }

  return cors(request, response, corsOptions);
}

export async function OPTIONS(request: Request) {
  return cors(request, new Response(null, { status: corsOptions.optionsSuccessStatus }), corsOptions);
}
