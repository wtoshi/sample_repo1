import createMiddleware from "next-intl/middleware";
import { pathnames, locales, localePrefix } from "./localization/config";

export default createMiddleware({
  defaultLocale: "tr",
  locales: ['en', 'tr'],
  pathnames,
  localePrefix,
});

export const config = {
  // Match only internationalized pathnames
  matcher: ["/", "/(tr|en)/:path*", "/((?!_next|_vercel|.*\\..*).*)"],
};