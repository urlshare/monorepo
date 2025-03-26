import { env } from "./env";
import pino from "pino";

export const logger = pino({ nestedKey: "payload", browser: { asObject: true }, level: env.LOG_LEVEL });
export type Logger = typeof logger;
