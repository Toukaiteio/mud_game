<template>
    <div class="GameTimeDisplay">
        {{ formatFullTime(Global_BasicPlayerData.GameNowTime) }}
    </div>
    <div class="MainWrapper">
        <div class="LogBox BOX">
            <p v-for="(_c,_i) in Global_BasicPlayerData.ThisRoundEvent" :key="`${_i}-Logs`" v-dompurify-html="_c">
            </p>
        </div>
        <div class="MoveBox BOX" v-if="Global_BasicPlayerData.PlayerAllowMove">
            <div class="LocationIntro"  v-dompurify-html="$t('_gamemain_player_locate')"></div>
            <div class="MoveItem" v-for="(_moveItem,_moveIndex) in Global_BasicPlayerData.PlayerLocationAround" :key="`${_moveIndex}-MoveItem`" @click="MoveTo(_moveItem['locationID']);">
                <div class="MoveProgressIndicator" v-show="Global_BasicPlayerData.PlayerMoveStatus[_moveItem['locationID']]['ActivateState']" :style="{width:`${parseFloat(((Global_BasicPlayerData.PlayerMoveStatus[_moveItem['locationID']]['NowTotal']/Global_BasicPlayerData.PlayerMoveStatus[_moveItem['locationID']]['Require'])*100).toFixed(2))}%`}"></div>
                <div class="Destination" v-dompurify-html="$t(_moveItem['name'])+`<font color='green'>(${formatTime(Math.round(_moveItem['cost'] / Global_BasicPlayerData.PlayerMoveStatus[_moveItem['locationID']]['IncreaseRate']))})</font>`"></div>
            </div>
        </div>
        <div class="ActionBox BOX">
            <div class="ActionIntro"  v-dompurify-html="$t('_gamemain_player_action')"></div>
            <div class="ActionItem" v-for="(_ActionItem,_ActionIndex) in Global_BasicPlayerData.RoundAllowActions" @click="generalOnActionHandler(_ActionIndex)" :key="`${_ActionIndex}-${Global_BasicPlayerData.PlayerLocate}-AtRound:${Global_BasicPlayerData.RoundCounter}`">
                <div class="ActionProgressIndicator" v-show="Global_BasicPlayerData.PlayerActionStatus[_ActionIndex]['ActivateState']" :style="{width:`${parseFloat(((Global_BasicPlayerData.PlayerActionStatus[_ActionIndex]['NowTotal']/Global_BasicPlayerData.PlayerActionStatus[_ActionIndex]['Require'])*100).toFixed(2))}%`}"></div>
                <div class="ActionName" v-dompurify-html="$t(_ActionItem['text'])+``"></div>
            </div>
        </div>
        <!-- <div class="NextRoundBtn" @click="GetRoundEvent()">TriggerAllEvent_DebugButton_NotInGame</div> -->
    </div>
</template>
<script lang="ts" setup>
import { useGameMainStorage } from '@/utils/store';
import GameEventList from '@/resources/game/events/events.json';
import GameLocationFunctionList from '@/resources/game/locations/LocationFunctions.json';
import { reactive } from 'vue';
const { Global_BasicPlayerData,RoundTempValues,actionParser,factorParser,conditionParser,locationEventParser,effectParser,$t }=useGameMainStorage();
import GameNPCDialog from '@/resources/game/npc/npc_dialog.json';
// I put Gamenpc dialog here just because I think there are too many things imported in store.ts.
// const GetEventTimes=():number=>{
//     return [0,0,1,2,0,0,3,0,2,1,1,1,0,0,1,0,0,1,0,2][Math.round((Math.random()*10000)%20)];
// }

// Add Progress Selector Bar - to indicate the progress of an action. √
// Add Give param in Event - to make event can give player item. * I can use Tag to seize this.
// Add cost param in Event - to make event time cost can be calculated. √
// Add cost_factor param in Event - to make event can be affect by some factor. √
const ScopedPageStateManager=reactive({
    Global_AllowActionTimes:1,
    
    
})
const generalOnActionHandler=(index:number):void=>{
    const _t_PlayerActionStatus_Accessor=(Global_BasicPlayerData.PlayerActionStatus as Array<any>)[index];
    const ActionCondition=_t_PlayerActionStatus_Accessor["Condition"]?conditionParser(_t_PlayerActionStatus_Accessor["Condition"],undefined,undefined,true,_t_PlayerActionStatus_Accessor["Affection"],true)["_direct_use_result_transer"]:true;
    if(!Global_BasicPlayerData.isPlayerActionLocking && ActionCondition){
        Global_BasicPlayerData.isPlayerActionLocking=true;
        //Register Time Counter
        _t_PlayerActionStatus_Accessor['ActivateState']=true;
        const _t_action_time_counter=setInterval( ()=>{
            if(_t_PlayerActionStatus_Accessor["NowTotal"]+parseFloat((_t_PlayerActionStatus_Accessor["IncreaseRate"]/4).toFixed(3))>=_t_PlayerActionStatus_Accessor["Require"]){
                //Trigger Effect
                setTimeout(()=>{
                    (Global_BasicPlayerData.RoundAllowActions[index] as Record<string,any>)["action"]();
                    Global_BasicPlayerData.isPlayerActionLocking=false;
                    _t_PlayerActionStatus_Accessor['ActivateState']=false;
                    _t_PlayerActionStatus_Accessor['NowTotal']=0;
                    console.log("Event End");
                },50);
                clearInterval(_t_action_time_counter);
            }else{
                //Add Increase Rate
                _t_PlayerActionStatus_Accessor["NowTotal"]+=parseFloat((_t_PlayerActionStatus_Accessor["IncreaseRate"]/4).toFixed(3))
            }
        },50);
        console.log(_t_action_time_counter);
    }else if(!Global_BasicPlayerData.isPlayerActionLocking && !ActionCondition){
        if(_t_PlayerActionStatus_Accessor["ActionFailText"])
            (Global_BasicPlayerData.ThisRoundEvent as Array<string>).push($t(_t_PlayerActionStatus_Accessor["ActionFailText"]));
    }
}
// const generalOnSelectHandler=()=>{
//     ScopedPageStateManager.Global_AllowActionTimes-=1;
//     ScopedPageStateManager.ToBeExcutedFunctions.push();
//     NextRound();
// }
const SetYearTotalMinute=()=>{
    Global_BasicPlayerData.ThisYearTotalMinutes=(Global_BasicPlayerData.GameYear % 400==0)||(Global_BasicPlayerData.GameYear % 4==0 && Global_BasicPlayerData.GameYear%100 !=0)?527040:525600;
}
const SaveGame=()=>{
    const _SaveName='_MUDGAMESAVEDATA_'+Global_BasicPlayerData.PlayerSaveName
    localStorage.setItem(_SaveName,JSON.stringify(Global_BasicPlayerData));
    const GameSaveFileList=JSON.parse(localStorage.getItem("GameSaveFiles") || '{"save":[]}') as Record<string,any>;
    if(GameSaveFileList["save"].indexOf(_SaveName)==-1){
        GameSaveFileList["save"].push(_SaveName);
        localStorage.setItem("GameSaveFiles",JSON.stringify(GameSaveFileList));
    }
} 
const DayPassed=()=>{
    if(Global_BasicPlayerData.GameAutoSave){
        SaveGame();
    }
    actionParser({"#FUNCTION_START_A_NEWDAY":1});
    Global_BasicPlayerData.DayOfWeek=(Global_BasicPlayerData.DayOfWeek+1)%7;
    return;
}
const MinutePassed=()=>{
    // Check if anything outdated.
    // 527040 minutes for 366 days.
    // 525600 minites for 365 days.
    if(Global_BasicPlayerData.GameNowTime>Global_BasicPlayerData.ThisYearTotalMinutes){
        Global_BasicPlayerData.GameNowTime=0;
        Global_BasicPlayerData.GameYear++;
        SetYearTotalMinute();
    }
    if(Global_BasicPlayerData.GameNowTime%(60 * 24)==0){
        DayPassed();
    }
    return;
}

const TimeAddUp=(Counts:number)=>{
    for(let i=0;i<Counts;i++){
        Global_BasicPlayerData.GameNowTime+=1;
        MinutePassed();
    }
}
const formatTime=(_time:number):string=>{
    const hour=`${Math.floor(_time / 60)}`.padStart(2,"0");
    const minute=`${_time%60}`.padStart(2,"0");
    return `${hour}:${minute}`;
}
const formatFullTime=(_time:number):string=>{
    const MonthDays=[];
    if(Global_BasicPlayerData.ThisYearTotalMinutes==525600){
        MonthDays.push(31,28,31,30,31,30,31,31,30,31,30,31);
    }else{
        MonthDays.push(31,29,31,30,31,30,31,31,30,31,30,31);
    }
    let _t_m_c=0;
    let _t_l_m=0;
    let _t_sum=0;
    for(const i of MonthDays){
        if(_t_sum<=_time){
            _t_sum+=i*24*60;
            _t_m_c+=1;
            _t_l_m=i*24*60;
        }else{
            _t_sum-=_t_l_m;
            break;
        }
    }
    _time-=_t_sum;
    const month=`${_t_m_c}`.padStart(2,"0");
    const day=`${Math.floor((_time)/(24*60))+1}`.padStart(2,"0");
    const rest=formatTime(_time-(parseInt(day)-1)*24*60);
    return `${month}.${day} At ${rest} `+$t(`_day${Global_BasicPlayerData.DayOfWeek}`);
}
const GetMapIntro=():void=>{
    Global_BasicPlayerData.ThisRoundEvent=[];
    const OriMapData:string=$t((Global_BasicPlayerData.GameOnMap as Record<string,any>)[Global_BasicPlayerData.PlayerLocate]["intro"]);
    (Global_BasicPlayerData.ThisRoundEvent as Array<string>).push(OriMapData);
}
const GetPlayerAccessable=():void=>{
    Global_BasicPlayerData.PlayerLocationAround=[];
    const OriMapData=(Global_BasicPlayerData.GameOnMap as Record<string,any>)[Global_BasicPlayerData.PlayerLocate];
    for(const i in OriMapData["linked"]){
        (Global_BasicPlayerData.PlayerMoveStatus as Record<string,any>)[i]={
            NowTotal:0,
            Require:OriMapData["linked"][i]["cost"],
            IncreaseRate:OriMapData["linked"][i]["factor"] ? factorParser(OriMapData["linked"][i]["factor"]):Global_BasicPlayerData.BaseActionProcessSpeedRate,
            ActivateState:false
        };
        (Global_BasicPlayerData.PlayerLocationAround as Array<any>).push({
            "name":(Global_BasicPlayerData.GameOnMap as Record<string,any>)[i]["name"],
            "locationID":i,
            "cost":OriMapData["linked"][i]["cost"]
        });
        
    }
}
const MoveTo=(lid:string):void=>{
    if(!Global_BasicPlayerData.isPlayerActionLocking){
        Global_BasicPlayerData.isPlayerActionLocking=true;
        const _t_PlayerMoveStatus_Accessor=(Global_BasicPlayerData.PlayerMoveStatus as Record<string,any>)[lid];
        _t_PlayerMoveStatus_Accessor["ActivateState"]=true;
        //Register Time Counter
        const _t_action_time_counter=setInterval( ()=>{
            if(_t_PlayerMoveStatus_Accessor["NowTotal"]+parseFloat((_t_PlayerMoveStatus_Accessor["IncreaseRate"]/4).toFixed(3))>=_t_PlayerMoveStatus_Accessor["Require"]){
                //Trigger Effect
                setTimeout(()=>{
                    TimeAddUp(_t_PlayerMoveStatus_Accessor["Require"]);
                    Global_BasicPlayerData.PlayerMoveStatus={};
                    ScopedPageStateManager.Global_AllowActionTimes=1;
                    Global_BasicPlayerData.PlayerLocate=lid;
                    Global_BasicPlayerData.PlayerLocateDisplay=$t((Global_BasicPlayerData.GameOnMap as Record<string,any>)[Global_BasicPlayerData.PlayerLocate]["name"]);
                    GetMapIntro();
                    //Trigger actionLeave Here
                    if(Global_BasicPlayerData.ToBeExcutedFunctions.length>0)
                    for(const i of (Global_BasicPlayerData.ToBeExcutedFunctions as Array<()=>void>)){
                        i();
                    }
                    Global_BasicPlayerData.ToBeExcutedFunctions=[];
                    Global_BasicPlayerData.isPlayerActionLocking=false;
                    GetActionList();
                    GetPlayerAccessable();
                    GetRoundEvent();
                    console.log("Move Event End");
                },50);
                clearInterval(_t_action_time_counter);
            }else{
                //Add Increase Rate
                _t_PlayerMoveStatus_Accessor["NowTotal"]+=parseFloat((_t_PlayerMoveStatus_Accessor["IncreaseRate"]/4).toFixed(3))
            }
        },50);
    }
}
interface DialogEffect{
    effect:Record<string,any>,
    useVal:Record<string,any>|undefined
}
const LoadNpcDialog=(TargetID:string)=>{
    //Find NPC
    const npc=(Global_BasicPlayerData.GameOnNpcs as Record<string,any>)[TargetID];
    console.log(TargetID);
    //Check if has dialog
    const dialog=(GameNPCDialog as Record<string,any>)[(npc as Record<string,any>)["usingDialog"]];
    const dialog_effects=([] as Array<DialogEffect>);
    if(dialog){
        for(const i in dialog){
            if(dialog[i]["condition"]){
                if(conditionParser(dialog[i]["condition"],undefined,undefined,true,dialog[i]["condition"]["affection"],true,dialog[i]["requireVal"])["_direct_use_result_transer"]){
                    if(dialog[i]["effect"])
                        dialog_effects.push(({
                            "effect":dialog[i]["effect"],
                            "useVal":dialog[i]["useVal"],
                        } as DialogEffect));
                    (Global_BasicPlayerData.ThisRoundEvent as Array<string>).push($t(i));
                }
                
            }else{
                if(dialog[i]["effect"])
                    dialog_effects.push(({
                                "effect":dialog[i]["effect"],
                                "useVal":dialog[i]["useVal"],
                            } as DialogEffect));
                (Global_BasicPlayerData.ThisRoundEvent as Array<string>).push($t(i));
            }
            
        }
    }else{
        (Global_BasicPlayerData.ThisRoundEvent as Array<string>).push($t((npc as Record<string,any>)["usingDialog"]))
    }
    console.log("Dialog Effect:",dialog_effects);
    for(const i of dialog_effects){
        effectParser(i["effect"],i["useVal"],undefined)();
    }
}
const PROGRAMHOLDER={
    "#PROGRAM_HOLD_TALK_FUNCTION":(TargetID:string)=>{
        (RoundTempValues as Record<string,any>)["#PROGRAM_HOLD_TALK_FUNCTION"]=$t("_function_TALK_Prefix")+$t((Global_BasicPlayerData as Record<string,any>)["GameOnNpcs"][TargetID]["name"]);
        (RoundTempValues as Record<string,any>)["#PROGRAM_HOLD_TALK_CONTENT"]=$t("_function_TALK_Prefix")+" \n";
    },
    "#PROGRAM_HOLD_TALK_FUNCTION_DO":(TargetID:string)=>{
        LoadNpcDialog(TargetID);
    },
    // "#PROGRAM_HOLD_PLANT_FUNCTION":(LocationID:string)=>{

    // }
}
const GetActionList=():void=>{
    Global_BasicPlayerData.RoundAllowActions=[];
    const _t=(Global_BasicPlayerData.GameOnMap as Record<string,any>)[Global_BasicPlayerData.PlayerLocate]["functions"];
    // console.log(_t);
    for(const i in _t){
        const _funcs=_t[i].split("#");
        let DoFunc="";
        const _t_GLFL=(GameLocationFunctionList as Record<string,any>);
        // console.log(_t_GLFL[_funcs[0]]["text"],_t_GLFL[_funcs[0]],_funcs[0])
        if(_t_GLFL[_funcs[0]]["text"])
        if(_t_GLFL[_funcs[0]]["text"].slice(0,13)=="#PROGRAM_HOLD"){
            if(_funcs[1]) (PROGRAMHOLDER as Record<string,any>)[_t_GLFL[_funcs[0]]["text"]](..._funcs.slice(1));
            DoFunc=_t_GLFL[_funcs[0]]["text"]+"_DO";
        }
        const _t_o={
            "text":_t_GLFL[_funcs[0]]["text"],
            "value":i,
            "action":()=>{
                locationEventParser(_t_GLFL[_funcs[0]],_funcs)();
                TimeAddUp(_t_GLFL[_funcs[0]]["cost"] || 1);
                if(DoFunc!="") (PROGRAMHOLDER as Record<string,any>)[DoFunc](..._funcs.slice(1));
        }
        };
        if(_t_GLFL[_funcs[0]]["actionLeave"]){
            (Global_BasicPlayerData.ToBeExcutedFunctions as Array<()=>void>).push(()=>{actionParser(_t_GLFL[_funcs[0]]["actionLeave"]);})
        }
        (Global_BasicPlayerData.RoundAllowActions as Array<any>).push(_t_o);
        (Global_BasicPlayerData.PlayerActionStatus as Array<any>).push({
            NowTotal:0,
            Require:_t_GLFL[_funcs[0]]["cost"],
            IncreaseRate:_t_GLFL[_funcs[0]]["factor"] ? factorParser(_t_GLFL[_funcs[0]]["factor"]):Global_BasicPlayerData.BaseActionProcessSpeedRate,
            ActivateState:false,
            Condition:_t_GLFL[_funcs[0]]["condition"],
            ActionFailText:_t_GLFL[_funcs[0]]["action-failed-text"],
            Affection:_t_GLFL[_funcs[0]]["condition"]? _t_GLFL[_funcs[0]]["condition"]["affection"]:undefined
        })
        
    }
}
const GetRoundEvent=():void=>{
    // console.log(1,GetEventTimes()+(Global_BasicPlayerData.RoundCounter==0?2:0));
    //Trigger All Event
    for(const j of (GameEventList as Array<Record<string,any>>)){
        if(conditionParser(j["condition"],undefined,undefined,true)["_direct_use_result_transer"]){
            if(j["useVal"]){
                effectParser(j["effect"],j["useVal"],j["text"])();
            }else{
                effectParser(j["effect"],undefined,j["text"])();
            }
            if(j["cost"]){
                Global_BasicPlayerData._Round_TotalTimeCost+=j["cost"];
            }
        }
            
    }
    //Calculate Total Time Passed.
    TimeAddUp(Global_BasicPlayerData._Round_TotalTimeCost);
    Global_BasicPlayerData._Round_TotalTimeCost=0;
    //Total Turn counts add 1.
    Global_BasicPlayerData.RoundCounter+=1;
}
GetMapIntro();
GetActionList();
GetPlayerAccessable();
//I leave this message to myself for reminding me to add a fishing minigame
</script>
<style lang="scss" scoped>
$BaseMainColor:#1F242B;
$BaseSecondaryColor:#0046FF;
$BaseSecondaryColor2:#F91941;
$BaseSecondaryColor3:#00B1FF;
$BaseSecondaryColor4:#008b7b;
$FontColor:lighten($BaseMainColor,40%);
$FontActive:lighten($BaseMainColor,55%);
.GameTimeDisplay{
    position: absolute;
    top: 0;
    left: 0;
    color:$BaseSecondaryColor3;
    word-break: keep-all;
    white-space: nowrap;
}
.MainWrapper{
    .BOX{
        width: 100%;
    }
    .MoveBox{
        display: flex;
        flex-wrap: wrap;
        .LocationIntro{
            width: 100%;
            font-size: 22px;
        }
        .MoveItem{
            height: 36px;
            line-height: 28px;
            vertical-align: middle;
            padding: 4px;
            margin-right: 6px;
            background-color: lighten($BaseMainColor,10%);;
            border: 2px solid $BaseSecondaryColor4;
            position: relative;
            .MoveProgressIndicator{
                position: absolute;
                top: 0;
                left: 0;
                width: 0%;
                height: 100%;
                z-index:10;
                background-color: $BaseSecondaryColor4;
            }
            .Destination{
                position: relative;
                height: 28px;
                font-size: 16px;
                line-height: 28px;
                vertical-align: middle;
                z-index: 15;
            }
            word-break: keep-all;
            white-space: nowrap;
        }
    }
    .ActionBox{
        .ActionIntro{
            width: 100%;
            font-size: 22px;
        }
        .ActionItem{
            width: 100%;
            height: 46px;
            position: relative;
            .ActionProgressIndicator{
                position: absolute;
                top: 0;
                left: 0;
                width: 0%;
                height: 100%;
                z-index:10;
                background-color: $BaseSecondaryColor4;
            }
            .ActionName{
                position: relative;
                height: 46px;
                font-size: 16px;
                padding: 8px;
                line-height: 30px;
                vertical-align: middle;
                z-index: 15;
            }
            word-break: keep-all;
            white-space: nowrap;
            color: lighten($FontColor,100%);
            transition: background 0.4s;
            background: lighten($BaseMainColor,10%);
        }
    }
    padding: 12px;
    overflow-x: hidden;
    overflow-y: scroll;
    &::-webkit-scrollbar{
        display: none;
    }
    .LogBox{
        padding: 6px;
        font-size: 13px;
    }
    .NextRoundBtn{
        height: 40px;
        width: 100%;
        background-color: red;
        color: white;
        text-align: center;
        line-height: 40px;
        vertical-align: middle;
    }
}
</style>
