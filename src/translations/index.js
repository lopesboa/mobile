// @flow

/* eslint-disable import/max-dependencies */

import LocalizedStrings from 'react-native-localization';

import type {Translations} from './_types';
import cs from './cs';
import de from './de';
import en_US from './en-us';
import en from './en';
import es from './es';
import fr from './fr';
import hu from './hu';
// eslint-disable-next-line no-shadow
import it from './it';
import ja from './ja';
import ko from './ko';
import nl from './nl';
import pl from './pl';
import pt from './pt';
import ro from './ro';
import ru from './ru';
import tr from './tr';
import uk from './uk';
import vi from './vi';
import zh_TW from './zh-tw';
import zh from './zh';

const translations: Translations = new LocalizedStrings({
  cs,
  de,
  'en-US': en_US,
  en,
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
  'zh-TW': zh_TW,
  zh
});

export default translations;
