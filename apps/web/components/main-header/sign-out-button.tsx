"use client";

import { createClient } from "@/supabase/utils/client";

async function signOut() {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error(error);
  }

  window.location.reload();
}

export function SignOutButton() {
  return (
    <button
      onClick={async () => {
        await signOut();
      }}
    >
      Sign out
    </button>
  );
}
