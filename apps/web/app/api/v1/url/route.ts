import { generateRequestId } from "@workspace/request/id/generate-request-id";
import { StatusCodes } from "http-status-codes";
import { getUserIdFromRequest } from "@/lib/get-user-id-from-request";
import { cors, CorsOptions } from "@/lib/cors";

const corsOptions: CorsOptions = {
  methods: ["GET", "POST", "OPTIONS"],
  optionsSuccessStatus: StatusCodes.NO_CONTENT,
};

export async function POST(request: Request) {
  console.log("POST route");
  console.log(await request.json());

  return Response.json({ success: true });
}

export async function OPTIONS(request: Request) {
  return cors(request, new Response(null, { status: corsOptions.optionsSuccessStatus }), corsOptions);
}
