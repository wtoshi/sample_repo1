import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NextIntlClientProvider, useMessages } from "next-intl";
import "../globals.css";
import Header from "@/components/shared/Header";
import { ThemeProvider } from "../../providers/themeProvider";
import { getTranslations } from 'next-intl/server';

// Providers
import MainContextProvider from "@/providers/mainContext";
import { ConnectionProvider } from "@/providers/useConnection";

import { Toaster } from "react-hot-toast";
import { PlayerProvider } from "@/providers/usePlayer";
import { GameProvider } from "@/providers/useGame";


const inter = Inter({ subsets: ["latin"] });

async function setMetadata() {
  const t = await getTranslations();

  metadata.title = t('Metadata.title');
  metadata.description = t('Metadata.description');
}

export const metadata: Metadata = {
  title: "Spelling Bee Game | Multiplayer",
  description: "Multiplayer spelling bee game for all ages. Play with friends or random opponents. Available in multiple languages.",
};

export default function LocaleLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {

  const messages = useMessages();
  setMetadata();

  return (
    <html lang={locale} suppressHydrationWarning={true}>
      <body className={`${inter.className} bg-lightColor dark:bg-darkColor`}>
      <NextIntlClientProvider locale={locale} messages={messages}>
        <MainContextProvider>
          <ConnectionProvider>
            <PlayerProvider>
              <GameProvider>
                <ThemeProvider
                  attribute="class"
                  defaultTheme="system"
                  enableSystem
                  disableTransitionOnChange
                >


                    <div className="flex flex-col h-screen">
                      <Header />
                      <div className="flex-1 flex justify-center items-center bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-200 via-slate-50 to-white dark:from-slate-900 dark:via-slate-950 dark:to-darkColor">

                        {children}
                      </div>
                    </div>

 
                </ThemeProvider>
              </GameProvider>
            </PlayerProvider>
          </ConnectionProvider>
        </MainContextProvider>
        </NextIntlClientProvider>
        <Toaster position="bottom-center" />
      </body>
    </html>
  );
}