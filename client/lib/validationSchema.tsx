import * as z from 'zod';
import { useLocale, useTranslations } from 'next-intl';


export const loginSchema = (t: (arg: string) => string)=> z.object({
  // avatar: z.string() || z.undefined(),
  nickname: z.string().min(2, t('ZodErrors.nicknameRequired')).max(20, t('ZodErrors.nicknameMaxLength')),
  password: z.string().min(6, t('ZodErrors.passwordMinLength'))
});

export const signupSchema = (t: (arg: string) => string)=> z.object({
  // avatar: z.string() || z.undefined(),
  nickname: z.string().min(2, t('ZodErrors.nicknameRequired')).max(20, t('ZodErrors.nicknameMaxLength')),
  password: z.string().min(6, t('ZodErrors.passwordMinLength'))
});




