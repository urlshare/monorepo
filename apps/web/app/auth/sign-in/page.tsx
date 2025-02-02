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
    <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-800">
      <div className="p-6 bg-white dark:bg-gray-700 rounded shadow-md">
        <h1 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">GitHub Authentication</h1>
        <button
          onClick={signInWithGithub}
          className="px-4 py-2 bg-black text-white rounded hover:bg-gray-700 dark:hover:bg-gray-600 mb-4"
        >
          Sign In with GitHub
        </button>
      </div>
    </div>
  );
}
