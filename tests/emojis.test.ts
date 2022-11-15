import { describe, expect, it } from "vitest";

import { parseEmojis } from "../src/controllers/emoji";

describe('parseEmojis()', ()=>{

    it('Should parse only known icons', ()=>{
        expect(parseEmojis("🟣"))
            .equals('<img class="emoji" src="/src/assets/icons/soul.svg">')

        
        expect(parseEmojis("🟣 with text"))
            .equals('<img class="emoji" src="/src/assets/icons/soul.svg"> with text')

        
        expect(parseEmojis("🧱 with text")).equals('🧱 with text')
    })

})