import soulImg from "../assets/icons/soul.svg"
import stoneImg from "../assets/icons/stone.svg"
import impImg from "../assets/icons/imp.svg"
import ratImg from "../assets/icons/rat.svg"
import humanImg from "../assets/icons/human.svg"
import boneImg from "../assets/icons/bones.svg"

const parseableEmojis = {
    '🟣': soulImg,
    '🪨': stoneImg,
    '😈': impImg,
    '🐀': ratImg,
    '👨': humanImg,
    '🦴': boneImg/*
    '👺': 'grunt',
    '🌇': 'imp',
    '🙍‍♂️': 'human',
    '🧝🏿‍♂️': 'dark-elf',
    '🤣': 'rofl',
    '😂':'laugh',
    '🎉':'party',
    '#{EKNU}': '',*/
}

export const AVAILABLE_EMOJIS: {[key: string]: string} = {
    'Souls' : '🟣',
    'Stones' : '🪨',
    'Bones' : '🦴',
    'Imp' : '😈',
    'Food' : '🐀',
    'Grunt' : '👺',
    'Buildings' : '🌇',
    'Humans' : '👨',
    'Human' : '🙍‍♂️',
    'Dark elf' : '🧝🏿‍♂️',
    'rofl' : '🤣',
    'laugh' : '😂',
    'party' : '🎉',
    '#{EKNU}': '',
}

const regex = /(\p{Emoji_Presentation}|#\{.+\})/gu
export function parseEmojis(html: string) {
    console.log("parsing emoji");
    
    return html.replaceAll(regex, (match) => {
        if(match in parseableEmojis) {
            return `<img class="emoji" src="${parseableEmojis[match as '🟣']}">`
        }
        return match
    })
}
