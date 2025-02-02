import { api } from "@/trpc/server";
import { TRPCError } from "@trpc/server";
import { Separator } from "@workspace/ui/components/separator";
import { ReactElement } from "react";
import { completeUserProfileSchema } from "@/modules/user-profile/schemas/complete-user-profile.schema";
import { ExistingUserProfileForm } from "@/modules/user-profile/ui/existing-user-profile-form";
import { NewUserProfileForm } from "@/modules/user-profile/ui/new-user-profile-form";

export default async function Page(): Promise<ReactElement> {
  try {
    const maybeCompletePrivateUserProfile = await api.userProfiles.getPrivateUserProfile();
    const completeUserProfile = completeUserProfileSchema.parse(maybeCompletePrivateUserProfile);

    return (
      <section className="space-y-6">
        <header className="space-y-1">
          <h3 className="text-xl font-medium tracking-tight">Profile settings</h3>
          <h4 className="text-sm font-light text-gray-500">Manage your profile settings here.</h4>
        </header>
        <Separator className="md:max-w-[450px]" />
        <ExistingUserProfileForm {...completeUserProfile} />
      </section>
    );
  } catch (error) {
    if (error instanceof TRPCError) {
      if (error.code === "NOT_FOUND") {
        return (
          <section className="space-y-6">
            <NewUserProfileForm />
          </section>
        );
      }
    }

    throw error;
  }
}
