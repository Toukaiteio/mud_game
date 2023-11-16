import { defineStore } from 'pinia';
import Map from '@/resources/game/locations/Locations.json';
import Npcs from '@/resources/game/npc/npc.json';
import functionEvents from '@/resources/game/events/functionEvents.json';
import _LangOption0 from '@/resources/lang/en-US.json';
import _LangOption1 from '@/resources/lang/zh-CN.json';
import TabAfterGame from '@/resources/game/page/TabAfterGame.json'
import TabBeforeGame from '@/resources/game/page/TabBeforeGame.json'
import GameVersion from '@/resources/game/GameVersion.json';
export interface LanguageType{
    langType:string,
    langDisplay:string,
    lang:Record<string,string>
}
const LList:Record<string,LanguageType>={
    "en-US":_LangOption0,
    "zh-CN":_LangOption1
}
/*
    9.5 - 10.25 //2000
    01.01.0=0;
    1、3、5、7、8 (31*5) 2 (29) 4、6、9 (30*2+5)
*/ 
type conditionAccept=number|string|boolean|Record<string,number>;
export const useGameMainStorage = defineStore('game_data',{
    state:()=>{
        return {
            Global_BasicPlayerData:{
                PlayerName:"",
                RoundCounter:0,
                GameYear:2000,
                GameNowTime:357120, // 2000.9.5
                DayOfWeek:2,
                ThisYearTotalMinutes:527040,
                GameAutoSave:true,
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
                GameOnMap:{},
                GameOnNpcs:{},
                GameVersion:{},
                PlayerActionStatus:[],
                isPlayerActionLocking:false,
                MenuSelecting:0,
                BaseActionProcessSpeedRate:1,
                ToBeExcutedFunctions:[], //store action_leave in this. Trigger When MoveTo was called.
                _Round_TotalTimeCost:0,
                PlayerMoveStatus:{}
            },
            RoundTempValues:{
            },
            MenuData:{
                MenuElement:TabBeforeGame,
                SecondaryMenuElement:[]
            },
            LoadedModFunction:{},
            indexMap:[],
            LanguageId:"zh-CN",
            LanguageResource:_LangOption0,
            GameMap:Map,
            GameNpc:Npcs,
            TabAfterGame:TabAfterGame,
            TabBeforeGame:TabBeforeGame,
        }
    },
    actions:{
        Chance(chance:number){
            const _t_r=(Math.random()*22573)%100;
            console.log(`Chance Function:Roll Chance(${chance}) And result was ${_t_r}`,_t_r<chance)
            return _t_r<chance;
        },
        Text_NestedMatchHandler(Ori:string,SearchStart:string,SearchEnd:string){
            let _t_str=Ori;
            //ignore end tag before first start tag;
            let startTagPosition=Ori.indexOf(SearchStart);
            let endTagPosition=Ori.indexOf(SearchEnd,startTagPosition+1);
            //Get Text Between The First two tags and find if there any start tag.
            if(startTagPosition!=-1 && endTagPosition!=-1){
                while(startTagPosition!=-1 && endTagPosition!=-1){
                    const _a=_t_str.slice(0,endTagPosition).lastIndexOf(SearchStart);
                    if(_a!=-1){
                        _t_str=_t_str.replaceAll(_t_str.slice(_a,endTagPosition+SearchEnd.length),this.ReadDataByString(_t_str.slice(_a+SearchStart.length,endTagPosition)));
                    }else{
                        _t_str.slice(startTagPosition+SearchStart.length,endTagPosition)
                        _t_str=_t_str.replaceAll(_t_str.slice(startTagPosition,endTagPosition+SearchEnd.length),this.ReadDataByString(_t_str.slice(startTagPosition+SearchStart.length,endTagPosition)));
                    }
                    startTagPosition=_t_str.indexOf(SearchStart);
                    endTagPosition=_t_str.indexOf(SearchEnd,startTagPosition+1);
                }
                return _t_str;
            }else
                return Ori;
            },
        ReadDataByString(DataPath:string):string{
            if((<LanguageType>this.LanguageResource)["lang"][DataPath]){
                return this.$t(DataPath);
            }
            const ori=DataPath.split('.');
            let Accessor:Record<string,any>;
            if((this.RoundTempValues as Record<string,any>)[ori[0]]){
                Accessor=this.RoundTempValues;
            }else{
                Accessor=this.Global_BasicPlayerData;
            }
            for(const i of ori){
                if(typeof Accessor[i]=="string"||typeof Accessor[i]=="number"){
                        return `${Accessor[i]}`;
                }else if(Accessor[i]){
                        Accessor=Accessor[i];
                }else{
                    console.log("Err:Unknown Value:"+i+" When Parsing "+DataPath,this.RoundTempValues);
                    return DataPath;
                }
            }
            return '';
        },
        $t(Id:string):string{
            if((<LanguageType>this.LanguageResource)["lang"][Id]){

                if(this.LanguageId!=this.LanguageResource.langType){
                    (<LanguageType>this.LanguageResource)=LList[this.LanguageId];
                }
                let _str:string=(<LanguageType>this.LanguageResource)["lang"][Id];
                // const ReplaceMent=_str.match(/<replace>([\s\S]*?)<\/replace>/g);
                _str=this.Text_NestedMatchHandler(_str,"<replace>","</replace>");
                _str=_str.replaceAll('\n',"<br/>");
                //if(/^[a-zA-Z0-9_.]{2,96}$/.test(Target))

                return _str;
            }else if((this.RoundTempValues as Record<string,any>)[Id]){
                    return (this.RoundTempValues as Record<string,any>)[Id].replaceAll('\n',"<br/>") || Id;
            }else{
                console.log("Err:Not found in Values:"+Id,this.RoundTempValues);
                return Id;
            }
        },
        InitGameVersion():void{
            this.Global_BasicPlayerData.GameVersion=GameVersion["Version"];
        },
        hasTag(tag:string):boolean{
            return (Object.keys(this.Global_BasicPlayerData.PlayerTags).indexOf(tag)!=-1)
        },
        isConditionName(condition:string):boolean{
            return (["has","equ","lss","gtr","leq","geq","neq","at","chance","eval"].indexOf(condition)!=-1)
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
        factorParser(oriFactorJson:Record<string,any>):number{

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
            for(const i in oriFactorJson){
                if(action[i.slice(0,4)]){
                    return action[i.slice(0,4)](this.Global_BasicPlayerData.BaseActionProcessSpeedRate,this.affectionParser(oriFactorJson[i]));
                }  
            }
            return this.Global_BasicPlayerData.BaseActionProcessSpeedRate;
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
                const _t=(this.RoundTempValues as Record<string,conditionAccept>)[ori];
                if(_t){
                    return _t; 
                }else return ori;
            }else return ori;
        },
        getNPCDialog(npcid:string){
            const NPCDialogID=(this.Global_BasicPlayerData.GameOnNpcs as Record<string,any>)[npcid]["usingDialong"] || null;

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
                        return that["Global_BasicPlayerData"]["PlayerLocate"]==getVal(_v);
                    },
                    "chance":(_t:string,_v:conditionAccept)=>{
                        let aff=0;
                        if(affection){
                            aff=this.affectionParser(affection);
                        }
                        console.log(`singleConditionParser: Affection:`,affection);
                        
                        return Chance((getVal(_v) as number)+aff);
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
                }else if(this.isGBValueName(i)["is"]){
                    _r=(_r && this.tagConditionParser(i,oriORConditionJson[i],affection));
                }else if(this.isFunctionName(i)){
                    _r=(_r || this.tagConditionParser(i,oriORConditionJson[i],affection));
                    if(_r){
                        if((functionEvents as Record<string,any>)[i]['text']) (this.Global_BasicPlayerData.ThisRoundEvent as Array<string>).push(this.$t((functionEvents as Record<string,any>)[i]['text']));
                        this.effectParser((functionEvents as Record<string,any>)[i]["effect"],(functionEvents as Record<string,any>)[i]["useVal"],(functionEvents as Record<string,any>)[i]["text"])();
                    }
                }else if(typeof oriORConditionJson[i]["has"]=='boolean'){
                    _r=_r || (this.hasTag(i)==oriORConditionJson[i]["has"]);
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
                }else if(this.isGBValueName(i)["is"]){
                    _r=(_r && this.tagConditionParser(i,oriANDConditionJson[i],affection));
                }else if(this.isFunctionName(i)){
                    _r=(_r && this.tagConditionParser(i,oriANDConditionJson[i],affection));
                    if(_r){
                        if((functionEvents as Record<string,any>)[i]['text']) (this.Global_BasicPlayerData.ThisRoundEvent as Array<string>).push(this.$t((functionEvents as Record<string,any>)[i]['text']));
                        this.effectParser((functionEvents as Record<string,any>)[i]["effect"],(functionEvents as Record<string,any>)[i]["useVal"],(functionEvents as Record<string,any>)[i]["text"])();
                    }
                }else if(typeof oriANDConditionJson[i]["has"]=='boolean'){
                    _r=_r && (this.hasTag(i)==oriANDConditionJson[i]["has"]);
                }
            }
            return _r;
        },
        tagConditionParser(tag:string,oriConditionJson:Record<string,any>,affection?:Record<string,any>,isFromFuction?:boolean):boolean{
            //support has,equ,lss,gtr,leq,geq,OR,AND
            let _r=true;
            console.log("tagCondition:Parsing:"+tag);
            for(const j in oriConditionJson){
                if(j.slice(0,3)=="#OR"){
                    _r=(_r && this.ORConditionHandler(tag,oriConditionJson[j],affection));
                    console.log("Result After OR",_r);
                }else if(j.slice(0,4)=="#AND"){
                    _r=(_r && this.ANDConditionHandler(tag,oriConditionJson[j],affection));
                    console.log("Result After AND",_r);
                }else if(this.isConditionName(j)){
                    _r=(_r && this.singleConditionHandler(tag,j,oriConditionJson[j],affection));
                    console.log("Result After isConditionName",_r);
                }else if(this.isGBValueName(j)["is"]){
                    _r=(_r && this.tagConditionParser(j,oriConditionJson[j],affection));
                    console.log("Result After isGBValueName",_r);
                }else if(this.isFunctionName(j)){
                    _r=(_r && this.tagConditionParser(j,oriConditionJson[j],affection));
                    console.log("Result After isFunctionName",_r);
                    if(_r){
                        if((functionEvents as Record<string,any>)[j]['text']) (this.Global_BasicPlayerData.ThisRoundEvent as Array<string>).push(this.$t((functionEvents as Record<string,any>)[j]['text']));
                        this.effectParser((functionEvents as Record<string,any>)[j]["effect"],(functionEvents as Record<string,any>)[j]["useVal"],(functionEvents as Record<string,any>)[j]["text"])();
                    }
                }else if(typeof oriConditionJson[j]["has"]=='boolean'){
                    _r=_r && (this.hasTag(j)==oriConditionJson[j]["has"]);
                    console.log("Result After hasTag",_r);
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
                if(this.isFunctionName(i)){
                    console.log("Find Function Name:"+i);
                    _r=(_r && this.tagConditionParser(i,oriConditionJson[i],affection,true));
                }
                for(const j in oriConditionJson[i]){
                    if(j=="condition-true" || j=="condition-false" ) break;
                    if(j.slice(0,3)=="#OR"){
                        _r=(_r && this.ORConditionHandler(i,oriConditionJson[i][j],affection));
                        console.log("ConditionTag Result After OR",_r);
                    }else if(j.slice(0,4)=="#AND"){
                        _r=(_r && this.ANDConditionHandler(i,oriConditionJson[i][j],affection));
                        console.log("ConditionTag Result After AND",_r);
                    }else if(this.isConditionName(j)){
                        _r=(_r && this.singleConditionHandler(i,j,oriConditionJson[i][j],affection));
                        console.log("ConditionTag Result After isConditionName",_r);
                    }else if(this.isGBValueName(j)["is"]){
                        _r=(_r && this.tagConditionParser(j,oriConditionJson[i][j],affection));
                        console.log("ConditionTag Result After isGBValueName",_r);
                    }else if(typeof oriConditionJson[i][j]["has"]=='boolean'){
                        _r=(this.hasTag(j)==oriConditionJson[i][j]["has"]);
                        console.log("ConditionTag Result After hasTag",_r);
                    }
                }
                let T_S="";
                if(useVal){
                    for(const j in useVal){
                        if(j==i){
                            T_S=j;
                            if(!(this.RoundTempValues as Record<string,any>)[useVal[j]])
                                (this.RoundTempValues as Record<string,any>)[useVal[j]]=0;
                            break;
                        }
                    }
                }
                
                if(_r && oriConditionJson[i]["condition-true"] && !isDirectlyUse && !isFromFuction){
                    _result[i]=oriConditionJson[i]["condition-true"]
                    if(T_S!="") (this.RoundTempValues as Record<string,any>)[useVal![T_S]]=oriConditionJson[i]["condition-true"]
                }else if(!_r && oriConditionJson[i]["condition-false"] && !isDirectlyUse && !isFromFuction){
                    _result[i]=oriConditionJson[i]["condition-false"]
                    if(T_S!="") (this.RoundTempValues as Record<string,any>)[useVal![T_S]]=oriConditionJson[i]["condition-false"]
                }
                _dir_r=_dir_r && _r;
            }
            if(pushLog)
                (this.Global_BasicPlayerData.ThisRoundEvent as Array<string>).push(this.$t(pushLog));
            if(isDirectlyUse)
                _result["_direct_use_result_transer"]=_dir_r;
            return _result;
        },
        actionParser(oriActionJson:Record<string,any>):void{
            for(const i in oriActionJson){
                console.log("ActionParser:Parsing "+i);
                if(i=="condition"){
                    for(const j in oriActionJson[i]){
                        const affection=oriActionJson[i][j]["affection"];

                        const _t_judge=this.tagConditionParser(j,oriActionJson[i][j],affection,true);
                        console.log('tagCondition judge:',_t_judge);
                        if(_t_judge){
                            console.log((functionEvents as Record<string,any>)[j]["effect"]);
                            if((functionEvents as Record<string,any>)[j]["effect"])
                                this.effectParser((functionEvents as Record<string,any>)[j]["effect"],(functionEvents as Record<string,any>)[j]["useVal"],(functionEvents as Record<string,any>)[j]["text"])();
                            else{
                                (this.Global_BasicPlayerData.ThisRoundEvent as Array<string>).push(this.$t((functionEvents as Record<string,any>)[j]["text"]));
                            }
                            // (this.Global_BasicPlayerData.RoundAllowActions as Array<string>).push((functionEvents as Record<string,any>)[j]["text"])
                            break;
                        }
                    }
                    // this.tagConditionParser(i,oriActionJson[i],affection,true);
                }else{
                    if(this.isFunctionName(i)){
                        const affection=oriActionJson[i]["affection"];
                        const _t_judge=this.tagConditionParser(i,oriActionJson[i],affection,true);
                        if(_t_judge){
                            if((functionEvents as Record<string,any>)[i]["effect"])
                                this.effectParser((functionEvents as Record<string,any>)[i]["effect"],(functionEvents as Record<string,any>)[i]["useVal"],(functionEvents as Record<string,any>)[i]["text"])();
                            else (this.Global_BasicPlayerData.ThisRoundEvent as Array<string>).push(this.$t((functionEvents as Record<string,any>)[i]["text"]));
                            // (this.Global_BasicPlayerData.RoundAllowActions as Array<string>).push((functionEvents as Record<string,any>)[i]["text"])
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
                        if(typeof _t[i]=="string"){
                            if((this.RoundTempValues as Record<string,any>)[_t[i]]) _t[i]=(this.RoundTempValues as Record<string,any>)[_t[i]];
                        }
                        if(_t_g["is"]){
                            this.modGBValueName(i,_t_g["value"]+_t[i])
                        }else{
                            (this.Global_BasicPlayerData.PlayerTags as Record<string,number>)[i]+=<number>_t[i]
                        }
                    }
                    pushLog=undefined;
                }else{
                    if(useVal){
                        for(const j in useVal){
                            if(j==i){
                                (this.RoundTempValues as Record<string,any>)[useVal[j]]=oriAddJson[i];
                                break;
                            }
                        }
                    }
                    
                    const _t_g=this.isGBValueName(i);
                    if(typeof oriAddJson[i]=="string"){
                        if((this.RoundTempValues as Record<string,any>)[oriAddJson[i]]) oriAddJson[i]=(this.RoundTempValues as Record<string,any>)[oriAddJson[i]];
                    }
                    if(_t_g["is"]){
                        this.modGBValueName(i,_t_g["value"]+oriAddJson[i])
                    }else{
                        (this.Global_BasicPlayerData.PlayerTags as Record<string,number>)[i]+=<number>oriAddJson[i]
                    }
                }
            }
            if(pushLog) (this.Global_BasicPlayerData.ThisRoundEvent as Array<string>).push(this.$t(pushLog));
        },
        minusParser(oriMinusJson:Record<string,any>,useVal?:Record<string,any>,pushLog?:string):void{
            for(const i in oriMinusJson){
                if(i=="condition"){
                    const _t=this.conditionParser(oriMinusJson[i],useVal,pushLog);
                    for(const i in _t){
                        const _t_g=this.isGBValueName(i);
                        if(typeof _t[i]=="string"){
                            if((this.RoundTempValues as Record<string,any>)[_t[i]]) _t[i]=(this.RoundTempValues as Record<string,any>)[_t[i]];
                        }
                        if(_t_g["is"]){
                            _t_g["value"]=_t_g["value"]-_t[i];
                        }else{
                            (this.Global_BasicPlayerData.PlayerTags as Record<string,number>)[i]-=<number>_t[i]
                        }
                    }
                    pushLog=undefined;
                }else{
                    const _t_g=this.isGBValueName(i);
                    if(typeof oriMinusJson[i]=="string"){
                        if((this.RoundTempValues as Record<string,any>)[oriMinusJson[i]]) oriMinusJson[i]=(this.RoundTempValues as Record<string,any>)[oriMinusJson[i]];
                    }
                    if(_t_g["is"]){
                        _t_g["value"]=_t_g["value"]-oriMinusJson[i];
                    }else{
                        (this.Global_BasicPlayerData.PlayerTags as Record<string,number>)[i]-=<number>oriMinusJson[i]
                    }
                }
            }
            if(pushLog) (this.Global_BasicPlayerData.ThisRoundEvent as Array<string>).push(this.$t(pushLog));
        },
        modifyParser(oriModifyJson:Record<string,any>,useVal?:Record<string,any>,pushLog?:string):void{
            for(const i in oriModifyJson){
                if(i=="condition"){
                    const _t=this.conditionParser(oriModifyJson[i],useVal,pushLog);
                    for(const i in _t){
                        const _t_g=this.isGBValueName(i);
                        if(typeof _t[i]=="string"){
                            if((this.RoundTempValues as Record<string,any>)[_t[i]]) _t[i]=(this.RoundTempValues as Record<string,any>)[_t[i]];
                        }
                        if(_t_g["is"]){
                            _t_g["value"]=_t[i];
                        }else{
                            (this.Global_BasicPlayerData.PlayerTags as Record<string,conditionAccept>)[i]=<conditionAccept>_t[i]
                        }
                    }
                    pushLog=undefined;
                }else{
                    if(useVal){
                        for(const j in useVal){
                            if(j==i){
                                (this.RoundTempValues as Record<string,any>)[useVal[j]]=oriModifyJson[i];
                                break;
                            }
                        }
                    }
                    
                    const _t_g=this.isGBValueName(i);
                    if(typeof oriModifyJson[i]=="string"){
                        if((this.RoundTempValues as Record<string,any>)[oriModifyJson[i]]) oriModifyJson[i]=(this.RoundTempValues as Record<string,any>)[oriModifyJson[i]];
                    }
                    if(_t_g["is"]){
                        _t_g["value"]=oriModifyJson[i];
                    }else{
                        (this.Global_BasicPlayerData.PlayerTags as Record<string,conditionAccept>)[i]=<conditionAccept>oriModifyJson[i]
                    }
                }
            }
            if(pushLog) (this.Global_BasicPlayerData.ThisRoundEvent as Array<string>).push(this.$t(pushLog));
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
                    pushLog=undefined;
                }else{
                    if(useVal){
                        for(const j in useVal){
                            if(j==i){
                                (this.RoundTempValues as Record<string,any>)[j]=0;
                                break;
                            }
                        }
                    }
                    
                    const _t_g=this.isGBValueName(i);
                    if(_t_g["is"]){
                        _t_g["value"]=-1;
                    }else{
                        delete (this.Global_BasicPlayerData.PlayerTags as Record<string,number>)[i];
                    }
                }
            }
            if(pushLog) (this.Global_BasicPlayerData.ThisRoundEvent as Array<string>).push(pushLog);
        },
        locationEventParser(oriLocationEventJson:Record<string,any>,applyVal?:Record<string,any>):()=>void{
            const actionParser=this.actionParser;
            return ()=>{
                for(const i in oriLocationEventJson){
                    if(i=="requireVal" && applyVal){
                        for(const j in oriLocationEventJson[i]){
                            (this.RoundTempValues as Record<string,any>)[`#$${j}`]=applyVal[oriLocationEventJson[i][j]["Slot"]];
                        }
                    }else if(i=="action"){
                        actionParser(oriLocationEventJson[i]);
                    }
                }
            }
        },
        effectParser(oriEffectJson?:Record<string,any>,useVal?:Record<string,any>,pushLog?:string):()=>void{
            const addParser=this.addParser;
            const minusParser=this.minusParser;
            const modifyParser=this.modifyParser;
            const removeParser=this.removeParser;
            return ()=>{
                for(const i in oriEffectJson){
                    if(i=="modify"){
                        modifyParser(oriEffectJson[i],useVal,pushLog);
                        pushLog=undefined;
                    }else if(i=="add"){
                        addParser(oriEffectJson[i],useVal,pushLog);
                        pushLog=undefined;
                    }else if(i=="minus"){
                        minusParser(oriEffectJson[i],useVal,pushLog);
                        pushLog=undefined;
                    }else if(i=="remove"){
                        removeParser(oriEffectJson[i],useVal,pushLog);
                        pushLog=undefined;
                    }
                }
            }
        }
    }
})
