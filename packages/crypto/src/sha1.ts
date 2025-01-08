import crypto from "node:crypto";

export const sha1 = (string: string) => crypto.createHash("sha1").update(string).digest("hex");
