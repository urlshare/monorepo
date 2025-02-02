import { LoggedInUserMenu } from "./logged-in-user-menu";
import { MainMenu } from "./main-menu";
import { LoggedOutUserMenu } from "./logged-out-user-menu";
import { User } from "@supabase/supabase-js";

export const MainHeader = async ({ user }: { user: User | null }) => {
  return (
    <header className="supports-backdrop-blur:bg-background/60 bg-background/95 sticky top-0 z-40 w-full border-b backdrop-blur">
      <div className="container place-self-center flex h-14 items-center px-4 sm:h-16 sm:px-8">
        <div className="flex items-center space-x-4 sm:space-x-8">
          <MainMenu />
        </div>

        <aside className="flex flex-1 items-center justify-end">
          <div>
            <div className="flex items-center justify-center h-14 bg-slate-600">
              {user ? <LoggedInUserMenu /> : <LoggedOutUserMenu />}
            </div>
          </div>
        </aside>
      </div>
    </header>
  );
};
