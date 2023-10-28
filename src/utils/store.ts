import { defineStore } from 'pinia';
import _LangOption0 from '@/resources/lang/en-US.json';
export interface LanguageType{
    langType:string,
    langDisplay:string,
    lang:Record<string,string>
}
const LList:Record<string,LanguageType>={
    "en-US":_LangOption0
}
export const useGameMainStorage = defineStore('game_data',{
    state:()=>{
        return {
            Global_BasicPlayerData:{
                PlayerName:"",
                PlayerGender:-1,
                PlayerGenderDisplay:"",
                GenderMap:["Male","<font color='pink'>Female</font>","NbMs","Nb<font color='pink'>F</font>s"],
                PlayerStatus:{
                    ATK:0,
                    DEF:0,
                    MOV:0
                },
                PlayerNameIsInited:false,
                PlayerGenderIsInited:false,
                PlayerStatusIsInited:false,
                PlayerTags:[],
                OtherStorage:{},
                OtherStorageInited:false,
            },
            LanguageId:"en-US",
            LanguageResource:_LangOption0,
        }
    },
    actions:{
        // LangLoader():Record<string,any>{
        //     const oLangOption:Record<string,any>=_LangOption0;
        //     for(const i in oLangOption["lang"]){
        //         const ReplaceMent=oLangOption["lang"][i].match(/<replace>([\s\S]*?)<\/replace>/g);
        //         if(ReplaceMent)
        //         for(const j of ReplaceMent){
        //             const Target=j.match(/<replace>([\s\S]*?)<\/replace>/)![1];
                    
        //             if(/^[a-zA-Z0-9_]{2,96}$/.test(Target)){
        //                 oLangOption["lang"][i]=oLangOption["lang"][i].replace(j,`{{Global_BasicPlayerData.${Target}}}`);
        //                 console.log(oLangOption["lang"][i]);
        //             }
        //         }
        //     }
        //     this.LanguageResource=<any>oLangOption;
        //     return oLangOption;
        // },
        $t(Id:string):string{
            if((<LanguageType>this.LanguageResource)["lang"][Id]){
                if(this.LanguageId!=this.LanguageResource.langType){
                    (<LanguageType>this.LanguageResource)=LList[this.LanguageId];
                }
                let _str:string=(<LanguageType>this.LanguageResource)["lang"][Id];
                const ReplaceMent=_str.match(/<replace>([\s\S]*?)<\/replace>/g);
                
                if(ReplaceMent){
                    for(const j of ReplaceMent){
                        const Target=j.match(/<replace>([\s\S]*?)<\/replace>/)![1];
                        if(/^[a-zA-Z0-9_.]{2,96}$/.test(Target)){
                            const ori=Target.split('.');
                            let toReplace="";
                            let Accessor=(<Record<string,any>>this.Global_BasicPlayerData);
                            for(const i of ori){
                                if(typeof Accessor[i]=="string"||typeof Accessor[i]=="number"){
                                        toReplace=`${Accessor[i]}`;
                                        break;
                                }else if(Accessor[i]){
                                        Accessor=Accessor[i];
                                }else{
                                    return "Parser Lang File Fail";
                                }
                            }
                            _str=_str.replace(j,`${toReplace}`);
                        }
                    }
                }
                return _str;
            }else{
                    throw new Error("Not A Valid Key!");
            }
        }
    }
})
