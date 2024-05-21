"use client"
import { locales } from "@/localization/config";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { usePathname,useRouter } from "@/localization/navigation";
import { useParams } from "next/navigation";
import { useTransition } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMainContext } from "@/providers/mainContext";

export default function LangSwitcher() {
  const t = useTranslations("LocaleSwitcher");

  const locale = useLocale();
  const curLocale = t("locale", { locale });

  const context = useMainContext();

  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const params = useParams();

  function onSelectChange(nextLocale: string) {
    console.log("nextLocale", nextLocale);
    context.setChangedLanguage(true);

    startTransition(() => {
      router.replace(
        // @ts-expect-error -- TypeScript will validate that only known `params`
        // are used in combination with a given `pathname`. Since the two will
        // always match for the current route, we can skip runtime checks.
        
        { pathname, params },
        { locale: nextLocale },
        
      );
   
      // Metada refresh!
      //router.refresh();
    });
  }

  return (
    <div className="flex gap-2 items-center ">
      <Select onValueChange={(e) => onSelectChange(e)}>
        <SelectTrigger className="w-[130px]">
          <div className="">
            <Image
              src={`/locale/${locale}.png`}
              alt={locale}
              width={24}
              height={24}
            />
          </div>
          <SelectValue placeholder={curLocale} />
        </SelectTrigger>
        <SelectContent>
          {locales.map((cur, index) => (
            <SelectItem key={index} value={cur} defaultValue={cur}>
              {t("locale", { locale: cur })}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
