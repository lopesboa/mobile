import translations from '../../translations';

export const getInterfaceLanguage = () => translations.getInterfaceLanguage();
export const setLanguage = (language: string) => translations.setLanguage(language);

export default {
  setLanguage,
  getInterfaceLanguage,
};
