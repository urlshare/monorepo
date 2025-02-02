import { Geist, Geist_Mono } from "next/font/google";

import "@workspace/ui/globals.css";
import { Providers } from "@/components/providers";
import { Metadata } from "next";
import { MainHeader } from "@/components/main-header/main-header";
import { MainFooter } from "@/components/main-footer";
import { createClient } from "@/supabase/utils/server";
import { SetUserProfileInState } from "@/modules/user-profile/ui/set-user-profile-in-state";

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Urlshare",
  description: "Share urls, see what other people are sharing",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased min-h-full`}>
        <Providers>
          <SetUserProfileInState user={user} />
          <MainHeader user={user} />

          <div className="container place-self-center">
            <div className="w-full flex flex-col sm:flex-row flex-wrap sm:flex-nowrap py-4 flex-grow">
              <div className="w-fixed w-full flex-shrink flex-grow-0 px-4 ">Left</div>
              <div className="w-full flex-grow pt-1 px-3">{children}</div>
              <div className="w-fixed w-full flex-shrink flex-grow-0 px-2">RIght</div>
            </div>
            <MainFooter />
          </div>
        </Providers>
      </body>
    </html>
  );
}
