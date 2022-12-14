import soulImg from "../assets/icons/soul.svg"
import stoneImg from "../assets/icons/stone.svg"
import impImg from "../assets/icons/imp.svg"
import ratImg from "../assets/icons/rat.svg"
import humanImg from "../assets/icons/human.svg"
import boneImg from "../assets/icons/bones.svg"

const parseableEmojis = {
    'ðĢ': soulImg,
    'ðŠĻ': stoneImg,
    'ð': impImg,
    'ð': ratImg,
    'ðĻ': humanImg,
    'ðĶī': boneImg/*
    'ðš': 'grunt',
    'ð': 'imp',
    'ðââïļ': 'human',
    'ð§ðŋââïļ': 'dark-elf',
    'ðĪĢ': 'rofl',
    'ð':'laugh',
    'ð':'party',
    '#{EKNU}': '',*/
}

export const AVAILABLE_EMOJIS: {[key: string]: string} = {
    'Souls' : 'ðĢ',
    'Stones' : 'ðŠĻ',
    'Bones' : 'ðĶī',
    'Imp' : 'ð',
    'Food' : 'ð',
    'Grunt' : 'ðš',
    'Buildings' : 'ð',
    'Humans' : 'ðĻ',
    'Human' : 'ðââïļ',
    'Dark elf' : 'ð§ðŋââïļ',
    'rofl' : 'ðĪĢ',
    'laugh' : 'ð',
    'party' : 'ð',
    '#{EKNU}': '',
}

const regex = /(\p{Emoji_Presentation}|#\{.+\})/gu
export function parseEmojis(html: string) {
    console.log("parsing emoji");
    
    return html.replaceAll(regex, (match) => {
        if(match in parseableEmojis) {
            return `<img class="emoji" src="${parseableEmojis[match as 'ðĢ']}">`
        }
        return match
    })
}
