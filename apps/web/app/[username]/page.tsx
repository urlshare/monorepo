import { type UserProfile } from "@workspace/db/types";

export default async function Page({ params }: { params: Promise<{ username: UserProfile["username"] }> }) {
  const { username } = await params;

  return (
    <div className="flex items-center justify-center min-h-svh">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">{username}</h1>
      </div>
    </div>
  );
}
