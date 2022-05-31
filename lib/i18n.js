import i18n from 'i18n-js';
import * as Localization from 'expo-localization';
import es from '../locales/es';
import en from '../locales/en';

i18n.translations = {
    'en': en,
    'es': es,
};

i18n.locale = Localization.locale.indexOf('-' || "_") !== -1
    ? Localization.locale.slice(0, 2)
    : Localization.locale;

i18n.fallbacks = true;

export default i18n;