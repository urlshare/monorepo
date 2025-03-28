import "@workspace/ui/globals.css";

import { Toaster } from "@workspace/ui/components/sonner";
import { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { JSX } from "react";

import { MainFooter } from "@/components/main-footer";
import { MainHeader } from "@/components/main-header/main-header";
import { Providers } from "@/components/providers";
import { SetUserProfileInState } from "@/features/user-profile/ui/set-user-profile-in-state";
import { createClient } from "@/supabase/utils/server";

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
}>): Promise<JSX.Element> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={`${fontSans.variable} ${fontMono.variable} min-h-full font-sans antialiased`}>
        <Providers>
          <SetUserProfileInState user={user} />
          <MainHeader user={user} />

          <div className="container place-self-center">
            {/* <div className="flex w-full flex-grow flex-col flex-wrap py-4 sm:flex-row sm:flex-nowrap">{children}</div> */}
            <div className="flex w-full columns-3 gap-8">{children}</div>
            <MainFooter />
          </div>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
