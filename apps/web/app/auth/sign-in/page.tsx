"use client";

import { getBaseUrl } from "@/lib/get-base-url";
import { createClient } from "@/supabase/utils/client";

const supabase = createClient();

async function signInWithGithub() {
  await supabase.auth.signInWithOAuth({
    provider: "github",
    options: { redirectTo: `${getBaseUrl()}/auth/callback` },
  });
}

export default function Home() {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-100 dark:bg-gray-800">
      <div className="rounded bg-white p-6 shadow-md dark:bg-gray-700">
        <h1 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">GitHub Authentication</h1>
        <button
          onClick={signInWithGithub}
          className="mb-4 rounded bg-black px-4 py-2 text-white hover:bg-gray-700 dark:hover:bg-gray-600"
        >
          Sign In with GitHub
        </button>
      </div>
    </div>
  );
}
