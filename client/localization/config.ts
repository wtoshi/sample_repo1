import { Pathnames } from "next-intl/navigation";

export const locales = ["en", "tr"] as const;


export const defaultLocale = 'tr' as const;

export const pathnames = {
  "/": "/",
  "/error": {
    en: "/error",
    tr: "/hata",
  },
} satisfies Pathnames<typeof locales>;

export const localePrefix = undefined;

export type AppPathnames = keyof typeof pathnames;