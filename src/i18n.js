import i18next from 'i18next'
import {initReactI18next} from 'react-i18next'
import XHR from 'i18next-xhr-backend'
import LanguageDetector from 'i18next-browser-languagedetector'
import { getPathBase } from './utils'

i18next.use(XHR).use(LanguageDetector).use(initReactI18next).init({
    backend: {
        loadPath: getPathBase() + '/locales/{{lng}}.json'
    },
    react: {
        useSuspense: true
    },
    // lng: 'en',  默认语言
    fallbackLng: 'en',
    preload: [
        'en', 'zh','zh-cn'
    ],
    keySeparator: false,
    interpolation: {
        escapeValue: false
    }
})


export default i18next
