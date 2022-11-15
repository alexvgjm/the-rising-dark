import { reactive } from 'vue';
import { parseEmojis } from './emoji';
import { CONSTANTS } from './constants';
import en from './en.json'

export type LOCALE = typeof en
export type LocaleEntry = {[key: string]: string | LocaleEntry}

export let LOC: LOCALE = reactive(en);

function treatLoc(loadedLoc: LOCALE) {
    mapLocale(loadedLoc, (val) => __t(val, CONSTANTS))
    mapLocale(loadedLoc, (val) => parseEmojis(val))
    Object.entries(loadedLoc).forEach(([key, val]) => {
        // @ts-ignore
        LOC[key] = val
    })
}

treatLoc(en)

export async function setLoc(lang: string) {
    if(lang === 'en') {
        return Promise.resolve(null)
    }
    return fetch(`/locale/${lang}.json`)
        .then(res=>res.json())
        .then(locale => treatLoc(locale))
}


function mapLocale(loc: LocaleEntry,  fn: (locText: string) => string) {
    Object.entries(loc).forEach(([key, value]) => {
        if(typeof(value) == 'string') {
            loc[key] = fn(value)
        } else {
            mapLocale(value, fn)
        }
    })
}

export function __t(msg: string, params: {[key: string]: any} = {}) {
    const regex = /\$\{(.+?)\}/g;
    const matchs = [...msg.matchAll(regex)].map(m => m[1])
    matchs.forEach(k => {
        if(k in params) {
            msg = msg.replaceAll('${' + k + '}', params[k])
        }
    })
    return msg
}