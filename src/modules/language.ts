import {DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES} from '../translations';

export const getMatchingLanguage = (
  languages: Array<string>,
  defaultLanguage: string,
  deviceLanguage: string,
): string => {
  const shortDeviceLanguage = deviceLanguage.split('-')[0];

  const candidates: Array<string> = [deviceLanguage, shortDeviceLanguage, defaultLanguage];

  const selectedLanguage: string | void = candidates.find(
    (language) => languages.includes(language) && SUPPORTED_LANGUAGES.includes(language),
  );

  return selectedLanguage || DEFAULT_LANGUAGE;
};
