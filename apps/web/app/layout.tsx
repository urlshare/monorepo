import { Geist, Geist_Mono } from "next/font/google";

import "@workspace/ui/globals.css";

import { Providers } from "@/components/providers";
import { Metadata } from "next";
import { MainHeader } from "@/components/main-header/main-header";
import { MainFooter } from "@/components/main-footer";
import { createClient } from "@/supabase/utils/server";
import { SetUserProfileInState } from "@/features/user-profile/ui/set-user-profile-in-state";
import { Toaster } from "@workspace/ui/components/sonner";

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
      <head />
      <body className={`${fontSans.variable} ${fontMono.variable} min-h-full font-sans antialiased`}>
        <Providers>
          <SetUserProfileInState user={user} />
          <MainHeader user={user} />

          <div className="container place-self-center">
            <div className="flex w-full flex-grow flex-col flex-wrap py-4 sm:flex-row sm:flex-nowrap">
              <div className="w-fixed w-full flex-shrink flex-grow-0 px-4">Left</div>
              <div className="w-full flex-grow px-3 pt-1">{children}</div>
              <div className="w-fixed w-full flex-shrink flex-grow-0 px-2">RIght</div>
            </div>
            <MainFooter />
          </div>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
