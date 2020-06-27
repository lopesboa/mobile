/* eslint-disable import/max-dependencies */

import LocalizedStrings from "react-native-localization";

import {Translations, SupportedLanguage} from "./_types";
import cs from "./cs";
import de from "./de";
// import en_US from './en-us';
import en from "./en";
import es from "./es";
import fr from "./fr";
import hu from "./hu";
// eslint-disable-next-line no-shadow
import it from "./it";
import ja from "./ja";
import ko from "./ko";
import nl from "./nl";
import pl from "./pl";
import pt from "./pt";
import ro from "./ro";
import ru from "./ru";
import tr from "./tr";
import uk from "./uk";
import vi from "./vi";
import zh_TW from "./zh-tw";
import zh from "./zh";

const localizedTranslations: {[key in SupportedLanguage]?: Translations} = {
    // keep this locale in first position to be the default language if none matches
    en,
    cs,
    de,
    // @todo uncomment this once mooc API supports en-US
    // 'en-US': en_US,
    es,
    fr,
    hu,
    it,
    ja,
    ko,
    nl,
    pl,
    pt,
    ro,
    ru,
    tr,
    uk,
    vi,
    "zh-TW": zh_TW,
    zh,
};

export const SUPPORTED_LANGUAGES: Array<SupportedLanguage> = Object.keys(
    localizedTranslations,
);
export const DEFAULT_LANGUAGE: SupportedLanguage = SUPPORTED_LANGUAGES[0];

type CustomLocalizedStrings = $Exact<
    Translations & {
        formatString: (...args: Array<string>) => string;
        getLanguage: (arg0: void) => SupportedLanguage;
        setLanguage: (arg0: SupportedLanguage | string) => void;
        getInterfaceLanguage: (arg0: void) => string | SupportedLanguage;
    }
>;

const translations: CustomLocalizedStrings = new LocalizedStrings(
    localizedTranslations,
);

export default translations;