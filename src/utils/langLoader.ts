import _LangOption from '@/resources/lang/en-US.json';
import { useGameMainStorage } from '@/utils/store';
const LangLoader=(oLangOption:Record<string,any>):Record<string,any>=>{    
    const _Accessor:Record<string,any>=useGameMainStorage();
    for(const i in oLangOption.lang){
        for(const j in oLangOption.lang[i].match(/<replace>([\s\S]*?)<\/replace>/g)){
            const Target=j.match(/<replace>([\s\S]*?)<\/replace>/)![1];
            oLangOption.lang[i].replace(j,_Accessor.$state.Global_BasicPlayerData[Target])
        }
    }
    return oLangOption;
}
export const _L=LangLoader(_LangOption);