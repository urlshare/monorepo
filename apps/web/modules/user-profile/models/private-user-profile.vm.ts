import { schema } from "@workspace/db/db";

export type PrivateUserProfileVM = Pick<schema.UserProfile, "username"> & Pick<schema.User, "id" | "apiKey">;

export const toPrivateUserProfileVM = ({ id, apiKey, username }: PrivateUserProfileVM): PrivateUserProfileVM => {
  return { id, apiKey, username };
};
