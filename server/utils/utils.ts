import { GameLanguages } from "./types";

export const convertLocaleToGameLanguage = (locale: string): GameLanguages => {
    switch (locale) {
      case 'en':
        return GameLanguages.en;
      case 'tr':
        return GameLanguages.tr;
      default:
        throw new Error(`Unsupported locale: ${locale}`);
    }
  };