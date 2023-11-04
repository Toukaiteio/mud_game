import { defineStore } from 'pinia';
import Map from '../../public/resources/game/locations/Locations.json';
import Npcs from '../../public/resources/game/npc/npc.json';
import functionEvents from '../../public/resources/game/events/functionEvents.json';
import _LangOption0 from '../../public/resources/lang/en-US.json';
export interface LanguageType{
    langType:string,
    langDisplay:string,
    lang:Record<string,string>
}
const LList:Record<string,LanguageType>={
    "en-US":_LangOption0
}
type conditionAccept=number|string|boolean|Record<string,number>;
export const useGameMainStorage = defineStore('game_data',{
    state:()=>{
        return {
            Global_BasicPlayerData:{
                PlayerName:"",
                RoundCounter:0,
                PlayerGender:-1,
                PlayerGenderDisplay:"",
                PlayerStatus:{
                    ATK:0,
                    DEF:0,
                    MOV:0,
                    HP:100,
                    HAPPY:50,
                    CASH:80
                },
                ThisRoundEvent:[],
                PlayerLocationAround:[],
                RoundAllowActions:[],
                PlayerBorn:-1,
                PlayerLocate:"-1",
                PlayerLocateDisplay:"",
                PlayerBornDisplay:"",
                PlayerSaveName:"",
                PlayerAllowMove:true,
                PlayerTags:{},
                OtherStorage:{},
                OtherStorageInited:false,
                GameOnMap:{},
                GameOnNpcs:{},
                MenuSelecting:0,
            },
            RoundTempVarable:{

            },
            MenuElement:[{
                _icon:"M304 128a80 80 0 1 0 -160 0 80 80 0 1 0 160 0zM96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM49.3 464H398.7c-8.9-63.3-63.3-112-129-112H178.3c-65.7 0-120.1 48.7-129 112zM0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3z",
                target:"./",
                _text:"_tab_create_character"}],
            LanguageId:"en-US",
            LanguageResource:_LangOption0,
            GameMap:Map,
            GameNpc:Npcs
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
        // ChangeMenuTo(index:number){
        //     this.Global_BasicPlayerData.MenuSelecting=index;
        // },
        Chance(chance:number){
            return (Math.random()*22573)%100<chance;
        },
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
                            let toReplace="";
                            if((<LanguageType>this.LanguageResource)["lang"][Target]){
                                toReplace=this.$t(Target);
                            }else{
                                const ori=Target.split('.');
                                
                                let Accessor:Record<string,any>;
                                if((this.RoundTempVarable as Record<string,any>)[ori[0]]){
                                    Accessor=this.RoundTempVarable;
                                }else{
                                    Accessor=this.Global_BasicPlayerData;
                                }
                                for(const i of ori){
                                    if(typeof Accessor[i]=="string"||typeof Accessor[i]=="number"){
                                            toReplace=`${Accessor[i]}`;
                                            break;
                                    }else if(Accessor[i]){
                                            Accessor=Accessor[i];
                                    }else{
                                        return Id;
                                    }
                                }
                            }
                            
                            _str=_str.replace(j,`${toReplace}`);
                        }
                    }
                    _str=_str.replaceAll('\n',"<br/>");
                }
                return _str;
            }else{
                    return Id;
            }
        },
        hasTag(tag:string):boolean{
            return (Object.keys(this.Global_BasicPlayerData.PlayerTags).indexOf(tag)!=-1)
        },
        isConditionName(condition:string):boolean{
            return (["has","equ","lss","gtr","leq","geq","neq","at","chance"].indexOf(condition)!=-1)
        },
        isFunctionName(name:string):boolean{
            return (Object.keys(functionEvents).indexOf(name)!=-1)
        },
        isGBValueName(name:string):Record<string,any>{
            let Accessor=(<Record<string,any>>this.Global_BasicPlayerData);
            const ori=name.split(".");
            for(const i of ori){
                if(typeof Accessor[i]=="string"||typeof Accessor[i]=="number"||typeof Accessor[i]=="boolean"){
                    return {"is":true,"value":Accessor[i]};
                }else if(Accessor[i]){
                        Accessor=Accessor[i];
                }else{
                    return {"is":false,"value":-1};
                }
            }
            return {"is":false,"value":-1};
        },
        modGBValueName(name:string,value:conditionAccept):void{
            let Accessor=(<Record<string,any>>this.Global_BasicPlayerData);
            const ori=name.split(".");
            for(const i of ori){
                if(typeof Accessor[i]=="string"||typeof Accessor[i]=="number"||typeof Accessor[i]=="boolean"){
                    Accessor[i]=value;
                }else if(Accessor[i]){
                        Accessor=Accessor[i];
                }else{
                    return;
                }
            }
        },
        affectionParser(oriAffectionJson:Record<string,any>):number{
            const action=({
                "#mul":(n1:number,n2:number)=>{ return n1*n2; },
                "#plu":(n1:number,n2:number)=>{ return n1+n2; },
                "#des":(n1:number,n2:number)=>{ return n1-n2; },
                "#div":(n1:number,n2:number)=>{ return n1/n2; },
                "#abs":(n1:number,n2:number)=>{ return Math.abs(n1); },
                "#max":(n1:number,n2:number)=>{ return Math.min(n1,n2);},
                "#min":(n1:number,n2:number)=>{ return Math.max(n1,n2);},
                "#typ":(n1:number,n2:number)=>{ return n1*n2; },
            } as Record<string,(n1:number,n2:number)=>number>);
            let affection=0;
            for(const i in oriAffectionJson){
                const _t_tag=this.isGBValueName(i);
                if(_t_tag["is"]){
                    let _t_store=_t_tag["value"];
                    for(const j in oriAffectionJson[i]){
                        _t_store=action[j.slice(0,4)](_t_store,oriAffectionJson[i][j]);
                    }
                    affection+=_t_store;
                }else if(this.hasTag(i)){
                    let _t_store=(this.Global_BasicPlayerData.PlayerTags as Record<string,number>)[i];
                    for(const j in oriAffectionJson[i]){
                        _t_store=action[j.slice(0,4)](_t_store,oriAffectionJson[i][j]);
                    }
                    affection+=_t_store;
                }else{
                    affection+=0;
                }
            }
            return affection;
        },
        getVal(ori:conditionAccept):conditionAccept{
            if(typeof ori == "string"){
                const _t=(this.RoundTempVarable as Record<string,conditionAccept>)[ori];
                if(_t){
                    return _t; 
                }else return ori;
            }else return ori;
        },
        singleConditionHandler(tag:string,condition:string,value:conditionAccept,affection?:Record<string,any>):boolean{
            const that=(this.Global_BasicPlayerData as Record<string,any>);
            const hasTag=this.hasTag;
            const Chance=this.Chance;
            const isGBValueName=this.isGBValueName
            const getVal=this.getVal;
            const _t_r2=isGBValueName(tag)
            if(_t_r2["is"]){
                return (((
                    {
                        "has": (_t:string,_v:conditionAccept)=>{
                            if(typeof _v=='boolean'){
                                return (_t_r2["is"]==getVal(_v));
                            }else{
                                return (isGBValueName(<string>getVal(_v))["is"]);
                            }
                        },
                        "equ":(_t:string,_v:conditionAccept)=>{
                            if(_t_r2["is"]){
                                return _t_r2["value"]==getVal(_v);
                            }else {return (false)}
                        },
                        "lss":(_t:string,_v:conditionAccept)=>{
                            if(_t_r2["is"]){
                                return _t_r2["value"]<getVal(_v);
                            }else{
                                return (false);
                            }
                        },
                        "gtr":(_t:string,_v:conditionAccept)=>{
                            if(_t_r2["is"]){
                                return _t_r2["value"]>getVal(_v);
                            }else{
                                return (false);
                            }
                        },
                        "leq":(_t:string,_v:conditionAccept)=>{
                            if(_t_r2["is"]){
                                return _t_r2["value"]<=getVal(_v);
                            }else{
                                return (false);
                            }
                        },
                        "geq":(_t:string,_v:conditionAccept)=>{
                            if(_t_r2["is"]){
                                return _t_r2["value"]>=getVal(_v);
                            }else{
                                return (false);
                            }
                        },
                        "neq":(_t:string,_v:conditionAccept)=>{
                            if(_t_r2["is"]){
                                return _t_r2["value"]!=getVal(_v);
                            }else{
                                return (false);
                            }
                        },
                        "at":(_t:string,_v:conditionAccept)=>{
                            if(_t_r2["is"]){
                                return that["Global_BasicPlayerData"]["PlayerLocate"]==getVal(_v);
                            }else{
                                return (false);
                            }
                        },
                        "chance":(_t:string,_v:conditionAccept)=>{
                            if(_t_r2["is"]){
                                let aff=0;
                                if(affection){
                                    aff=this.affectionParser(affection);
                                }
                                return Chance((getVal(_v) as number)+aff);
                            }else{
                                return (false);
                            }
                        },
                    }
                ) as Record<string,(_t:string,_v:conditionAccept)=>boolean>)[condition])(tag,value)
            }else return (((
                {
                    "has": (_t:string,_v:conditionAccept)=>{
                        if(typeof _v=='boolean'){
                            return (hasTag(_t)==getVal(_v));
                        }else{
                            return (hasTag(<string>getVal(_v)));
                        }
                    },
                    "equ":(_t:string,_v:conditionAccept)=>{
                        if(hasTag(_t)){
                            return that["PlayerTags"][_t]==getVal(_v);
                        }else {return (false)}
                    },
                    "lss":(_t:string,_v:conditionAccept)=>{
                        if(hasTag(_t)){
                            return that["PlayerTags"][_t]<getVal(_v);
                        }else{
                            return (false);
                        }
                    },
                    "gtr":(_t:string,_v:conditionAccept)=>{
                        if(hasTag(_t)){
                            return that["PlayerTags"][_t]>getVal(_v);
                        }else{
                            return (false);
                        }
                    },
                    "leq":(_t:string,_v:conditionAccept)=>{
                        if(hasTag(_t)){
                            return that["PlayerTags"][_t]<=getVal(_v);
                        }else{
                            return (false);
                        }
                    },
                    "geq":(_t:string,_v:conditionAccept)=>{
                        if(hasTag(_t)){
                            return that["PlayerTags"][_t]>=getVal(_v);
                        }else{
                            return (false);
                        }
                    },
                    "neq":(_t:string,_v:conditionAccept)=>{
                        if(hasTag(_t)){
                            return that["PlayerTags"][_t]!=getVal(_v);
                        }else{
                            return (false);
                        }
                    },
                    "at":(_t:string,_v:conditionAccept)=>{
                        if(hasTag(_t)){
                            return that["Global_BasicPlayerData"]["PlayerLocate"]==getVal(_v);
                        }else{
                            return (false);
                        }
                    },
                    "chance":(_t:string,_v:conditionAccept)=>{
                        if(hasTag(_t)){
                            let aff=0;
                            if(affection){
                                aff=this.affectionParser(affection);
                            }
                            return Chance((getVal(_v) as number)+aff);
                        }else{
                            return (false);
                        }
                    },
                }
            ) as Record<string,(_t:string,_v:conditionAccept)=>boolean>)[condition])(tag,<conditionAccept>value)
            
        },
        ORConditionHandler(tag:string,oriORConditionJson:Record<string,any>,affection?:Record<string,any>):boolean{
            // const _data=Object.keys(oriORConditionJson);
            let _r=false;
            for(const i in oriORConditionJson){
                if(i.slice(0,3)=="#OR"){
                    _r=(_r || this.ORConditionHandler(tag,oriORConditionJson[i],affection));
                }else if(i.slice(0,4)=="#AND"){
                    _r=(_r || this.ANDConditionHandler(tag,oriORConditionJson[i],affection));
                }else if(this.isConditionName(i)){
                    _r=(_r || this.singleConditionHandler(tag,i,oriORConditionJson[i],affection));
                }else if(this.hasTag(i)){
                    _r=(_r || this.tagConditionParser(i,oriORConditionJson[i],affection));
                }else if(this.isGBValueName(i)["is"]){
                    _r=(_r && this.tagConditionParser(i,oriORConditionJson[i],affection));
                }else if(this.isFunctionName(i)){
                    _r=(_r && this.tagConditionParser(i,oriORConditionJson[i],affection));
                }
            }
            return _r;
        },
        ANDConditionHandler(tag:string,oriANDConditionJson:Record<string,any>,affection?:Record<string,any>):boolean{
            let _r=true;
            for(const i in oriANDConditionJson){
                if(i.slice(0,3)=="#OR"){
                    _r=(_r && this.ORConditionHandler(tag,oriANDConditionJson[i],affection));
                }else if(i.slice(0,4)=="#AND"){
                    _r=(_r && this.ANDConditionHandler(tag,oriANDConditionJson[i],affection));
                }else if(this.isConditionName(i)){
                    _r=(_r && this.singleConditionHandler(tag,i,oriANDConditionJson[i],affection));
                }else if(this.hasTag(i)){
                    _r=(_r && this.tagConditionParser(i,oriANDConditionJson[i],affection));
                }else if(this.isGBValueName(i)["is"]){
                    _r=(_r && this.tagConditionParser(i,oriANDConditionJson[i],affection));
                }else if(this.isFunctionName(i)){
                    _r=(_r && this.tagConditionParser(i,oriANDConditionJson[i],affection));
                }
            }
            return _r;
        },
        tagConditionParser(tag:string,oriConditionJson:Record<string,any>,affection?:Record<string,any>):boolean{
            //support has,equ,lss,gtr,leq,geq,OR,AND
            let _r=true;
            for(const j in oriConditionJson){
                if(j.slice(0,3)=="#OR"){
                    _r=(_r && this.ORConditionHandler(tag,oriConditionJson[j],affection));
                }else if(j.slice(0,4)=="#AND"){
                    _r=(_r && this.ANDConditionHandler(tag,oriConditionJson[j],affection));
                }else if(this.isConditionName(j)){
                    _r=(_r && this.singleConditionHandler(tag,j,oriConditionJson[j],affection));
                }else if(this.hasTag(j)){
                    _r=(_r && this.tagConditionParser(j,oriConditionJson[j],affection));
                }else if(this.isGBValueName(j)["is"]){
                    _r=(_r && this.tagConditionParser(j,oriConditionJson[j],affection));
                }else if(this.isFunctionName(j)){
                    _r=(_r && this.tagConditionParser(j,oriConditionJson[j],affection));
                }
            }
            return _r;
        },
        conditionParser(oriConditionJson:Record<string,any>,useVal?:Record<string,any>,pushLog?:string,isDirectlyUse=false,affection?:Record<string,any>,isFromFuction?:boolean,requireVal?:Record<string,any>):Record<string,any>{
            //support has,equ,lss,gtr,leq,geq,neq,OR,AND
            let _dir_r=true;
            const _result=<Record<string,any>>{};
            for(const i in oriConditionJson){
                let _r=true;
                for(const j in oriConditionJson[i]){
                    if(j=="condition-true" || j=="condition-false" ) break;
                    if(j.slice(0,3)=="#OR"){
                        _r=(_r && this.ORConditionHandler(i,oriConditionJson[i][j],affection));
                    }else if(j.slice(0,4)=="#AND"){
                        _r=(_r && this.ANDConditionHandler(i,oriConditionJson[i][j],affection));
                    }else if(this.isConditionName(j)){
                        
                        _r=(_r && this.singleConditionHandler(i,j,oriConditionJson[i][j],affection));
                    }else if(this.hasTag(j)){
                        _r=(_r && this.tagConditionParser(j,oriConditionJson[i][j],affection));
                    }else if(this.isGBValueName(j)["is"]){
                        _r=(_r && this.tagConditionParser(j,oriConditionJson[i][j],affection));
                    }else if(this.isFunctionName(j)){
                        _r=(_r && this.tagConditionParser(j,oriConditionJson[i][j],affection));
                        if(_r && isFromFuction){
                            this.effectParser((functionEvents as Record<string,any>)[j]["effect"],(functionEvents as Record<string,any>)[j]["useVal"],(functionEvents as Record<string,any>)[j]["text"])();
                        }
                    }
                    
                }
                let T_S="";
                if(useVal){
                    for(const j in useVal){
                        if(j==i){
                            T_S=j;
                            (this.RoundTempVarable as Record<string,any>)[j]=0;
                            break;
                        }
                    }
                }
                
                if(_r && oriConditionJson[i]["condition-true"] && !isDirectlyUse && !isFromFuction){
                    _result[i]=oriConditionJson[i]["condition-true"]
                    if(T_S!="") (this.RoundTempVarable as Record<string,any>)[useVal![T_S]]=oriConditionJson[i]["condition-true"]
                }else if(!_r && oriConditionJson[i]["condition-false"] && !isDirectlyUse && !isFromFuction){
                    _result[i]=oriConditionJson[i]["condition-false"]
                    if(T_S!="") (this.RoundTempVarable as Record<string,any>)[useVal![T_S]]=oriConditionJson[i]["condition-false"]
                }
                _dir_r=_dir_r && _r;
            }
            if(pushLog)
                (this.Global_BasicPlayerData.ThisRoundEvent as Array<string>).push(pushLog);
            if(isDirectlyUse)
                _result["_direct_use_result_transer"]=_dir_r;
            return _result;
        },
        actionParser(oriActionJson:Record<string,any>,useVal?:Record<string,any>,pushLog?:string,affection?:Record<string,any>):void{
            for(const i in oriActionJson){
                if(i=="condition"){
                    this.conditionParser(oriActionJson[i],useVal,pushLog,true,affection,true);
                }else{
                    if(this.isFunctionName(i)){
                        const _t_judge=this.tagConditionParser(i,oriActionJson[i],affection);
                        if(_t_judge){
                            this.effectParser((functionEvents as Record<string,any>)[i]["effect"],(functionEvents as Record<string,any>)[i]["useVal"],(functionEvents as Record<string,any>)[i]["text"])();
                        }
                    }
                }
            }
        },
        addParser(oriAddJson:Record<string,any>,useVal?:Record<string,any>,pushLog?:string):void{
            for(const i in oriAddJson){
                if(i=="condition"){
                    const _t=this.conditionParser(oriAddJson[i],useVal,pushLog);
                    for(const i in _t){
                        const _t_g=this.isGBValueName(i);
                        if(_t_g["is"]){
                            this.modGBValueName(i,_t_g["value"]+_t[i])
                        }else{
                            (this.Global_BasicPlayerData.PlayerTags as Record<string,number>)[i]+=<number>_t[i]
                        }
                    }
                }else{
                    const _t_g=this.isGBValueName(i);
                    if(_t_g["is"]){
                        this.modGBValueName(i,_t_g["value"]+oriAddJson[i])
                    }else{
                        (this.Global_BasicPlayerData.PlayerTags as Record<string,number>)[i]+=<number>oriAddJson[i]
                    }
                }
            }
        },
        minusParser(oriMinusJson:Record<string,any>,useVal?:Record<string,any>,pushLog?:string):void{
            for(const i in oriMinusJson){
                if(i=="condition"){
                    const _t=this.conditionParser(oriMinusJson[i],useVal,pushLog);
                    for(const i in _t){
                        const _t_g=this.isGBValueName(i);
                        if(_t_g["is"]){
                            _t_g["value"]=_t_g["value"]-_t[i];
                        }else{
                            (this.Global_BasicPlayerData.PlayerTags as Record<string,number>)[i]-=<number>_t[i]
                        }
                    }
                }else{
                    const _t_g=this.isGBValueName(i);
                    if(_t_g["is"]){
                        _t_g["value"]=_t_g["value"]-oriMinusJson[i];
                    }else{
                        (this.Global_BasicPlayerData.PlayerTags as Record<string,number>)[i]-=<number>oriMinusJson[i]
                    }
                }
            }
        },
        modifyParser(oriModifyJson:Record<string,any>,useVal?:Record<string,any>,pushLog?:string):void{
            for(const i in oriModifyJson){
                if(i=="condition"){
                    const _t=this.conditionParser(oriModifyJson[i],useVal,pushLog);
                    for(const i in _t){
                        const _t_g=this.isGBValueName(i);
                        if(_t_g["is"]){
                            _t_g["value"]=_t[i];
                        }else{
                            (this.Global_BasicPlayerData.PlayerTags as Record<string,number>)[i]=<number>_t[i]
                        }
                    }
                }else{
                    const _t_g=this.isGBValueName(i);
                    if(_t_g["is"]){
                        _t_g["value"]=oriModifyJson[i];
                    }else{
                        (this.Global_BasicPlayerData.PlayerTags as Record<string,number>)[i]=<number>oriModifyJson[i]
                    }
                }
            }
        },
        removeParser(oriRemoveJson:Record<string,any>,useVal?:Record<string,any>,pushLog?:string):void{
            for(const i in oriRemoveJson){
                if(i=="condition"){
                    const _t=this.conditionParser(oriRemoveJson[i],useVal,pushLog);
                    for(const i in _t){
                        const _t_g=this.isGBValueName(i);
                        if(_t_g["is"]){
                            _t_g["value"]=-1;
                        }else{
                            delete (this.Global_BasicPlayerData.PlayerTags as Record<string,number>)[i];
                        }
                    }
                }else{
                    const _t_g=this.isGBValueName(i);
                    if(_t_g["is"]){
                        _t_g["value"]=-1;
                    }else{
                        delete (this.Global_BasicPlayerData.PlayerTags as Record<string,number>)[i];
                    }
                }
            }
        },
        locationEventParser(oriLocationEventJson:Record<string,any>,useVal?:Record<string,any>,pushLog?:string,affection?:Record<string,any>,applyVal?:Record<string,any>):()=>void{
            const actionParser=this.actionParser;
            return ()=>{
                for(const i in oriLocationEventJson){
                    if(i=="requireVal" && applyVal){
                        for(const j in oriLocationEventJson[i]){
                            (this.RoundTempVarable as Record<string,any>)[`#$${j}`]=applyVal[oriLocationEventJson[i][j]["Slot"]];
                        }
                    }else if(i=="action"){
                        actionParser(oriLocationEventJson[i],undefined,undefined,affection);
                    }
                }
            }
        },
        effectParser(oriEffectJson:Record<string,any>,useVal?:Record<string,any>,pushLog?:string):()=>void{
            const addParser=this.addParser;
            const minusParser=this.minusParser;
            const modifyParser=this.modifyParser;
            const removeParser=this.removeParser;
            return ()=>{
                for(const i in oriEffectJson){
                    if(i=="modify"){
                        modifyParser(oriEffectJson[i],useVal,pushLog);
                    }else if(i=="add"){
                        addParser(oriEffectJson[i],useVal,pushLog);
                    }else if(i=="minus"){
                        minusParser(oriEffectJson[i],useVal,pushLog);
                    }else if(i=="remove"){
                        removeParser(oriEffectJson[i],useVal,pushLog);
                    }
                }
            }
        }
    }
})
