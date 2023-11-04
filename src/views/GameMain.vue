<template>
    <div class="MainWrapper">
        <div class="LogBox BOX">
            <p v-for="(_c,_i) in Global_BasicPlayerData.ThisRoundEvent" :key="`${_i}-Logs`" v-dompurify-html="$t(_c)">
            </p>
        </div>
        <div class="MoveBox BOX" v-if="Global_BasicPlayerData.PlayerAllowMove">
            <div class="LocationIntro"  v-dompurify-html="$t('_gamemain_player_locate')"></div>
            <div class="MoveItem" v-for="(_moveItem,_moveIndex) in Global_BasicPlayerData.PlayerLocationAround" :key="`${_moveIndex}-MoveItem`" @click="MoveTo(_moveItem['locationID']);" v-dompurify-html="$t(_moveItem['name'])+`<font color='green'>(${formatTime(_moveItem['cost'])})</font>`">
            </div>
        </div>
        <div class="ActionBox BOX">
            <div class="ActionIntro"  v-dompurify-html="$t('_gamemain_player_action')"></div>
            <DysSelector @on-selected="generalOnSelectHandler" @on-canceled="generalOnCanceledHandler" :max-allow-selection="1" :limit-allow-selection="ScopedPageStateManager.Global_RestAllowActionTimes" :selector-props="Global_BasicPlayerData.RoundAllowActions"></DysSelector>
        </div>
        <div class="NextBox BOX">
            <div class="NextRoundAction">

            </div>
        </div>
        <!-- <div class="NextRoundBtn" @click="GetRoundEvent()">TriggerAllEvent_DebugButton_NotInGame</div> -->
    </div>
</template>
<script lang="ts" setup>
import { useGameMainStorage } from '@/utils/store';
import GameEventList from '../../public/resources/game/events/events.json';
import GameLocationFunctionList from '../../public/resources/game/locations/LocationFunctions.json';
import DysSelector from '@/components/DysSelector.vue';
import { reactive } from 'vue';
const { Global_BasicPlayerData,RoundTempVarable,actionParser,conditionParser,effectParser,$t }=useGameMainStorage();
// const GetEventTimes=():number=>{
//     return [0,0,1,2,0,0,3,0,2,1,1,1,0,0,1,0,0,1,0,2][Math.round((Math.random()*10000)%20)];
// }
const ScopedPageStateManager=reactive({
    Global_RestAllowActionTimes:1
})
const generalOnSelectHandler=()=>{
    ScopedPageStateManager.Global_RestAllowActionTimes-=1;
}
const generalOnCanceledHandler=(data:number)=>{
    ScopedPageStateManager.Global_RestAllowActionTimes+=1;
}
const formatTime=(_time:number):string=>{
    const hour=`${Math.floor(_time / 60)}`.padStart(2,"0");
    const minute=`${_time%60}`.padStart(2,"0");
    return `${hour}:${minute}`;
}
const GetPlayerAccessable=():void=>{
    Global_BasicPlayerData.PlayerLocationAround=[];
    const OriMapData=(Global_BasicPlayerData.GameOnMap as Record<string,any>)[Global_BasicPlayerData.PlayerLocate];
    for(const i in OriMapData["linked"]){
        (Global_BasicPlayerData.PlayerLocationAround as Array<any>).push({
            "name":(Global_BasicPlayerData.GameOnMap as Record<string,any>)[i]["name"],
            "locationID":i,
            "cost":OriMapData["linked"][i]["cost"]
        })
    }
}
const MoveTo=(lid:string):void=>{
    Global_BasicPlayerData.PlayerLocate=lid;
    Global_BasicPlayerData.PlayerLocateDisplay=$t((Global_BasicPlayerData.GameOnMap as Record<string,any>)[Global_BasicPlayerData.PlayerLocate]["name"]);
    GetActionList();
    GetPlayerAccessable();
    GetRoundEvent();
}
const PROGRAMHOLDER={
    "#PROGRAM_HOLD_TALK_FUNCTION":(TargetID:string)=>{ //bug here. It equals its future value;
        (RoundTempVarable as Record<string,any>)["#PROGRAM_HOLD_TALK_FUNCTION"]=$t("_function_TALK_Prefix")+"<font color='yellow'>"+$t((Global_BasicPlayerData as Record<string,any>)["GameOnNpcs"][TargetID]["name"])+"</font>";
        // console.log($t((Global_BasicPlayerData as Record<string,any>)["GameOnNpcs"]),TargetID,(RoundTempVarable as Record<string,any>)["#PROGRAM_HOLD_TALK_FUNCTION"]);
    }
}
const GetActionList=():void=>{
    Global_BasicPlayerData.RoundAllowActions=[];
    const _t=(Global_BasicPlayerData.GameOnMap as Record<string,any>)[Global_BasicPlayerData.PlayerLocate]["functions"];
    // console.log(_t);
    for(const i in _t){
        const _funcs=_t[i].split("#");
        const _t_GLFL=(GameLocationFunctionList as Record<string,any>);
        // console.log(_t_GLFL[_funcs[0]]["text"],_t_GLFL[_funcs[0]],_funcs[0])
        if(_t_GLFL[_funcs[0]]["text"])
        if(_t_GLFL[_funcs[0]]["text"].slice(0,13)=="#PROGRAM_HOLD"){
            if(_funcs[1]) (PROGRAMHOLDER as Record<string,any>)[_t_GLFL[_funcs[0]]["text"]](_funcs[1]);
        }
        const _t_o={
            "text":_t_GLFL[_funcs[0]]["text"],
            "icon":null,
            "value":i,
            "action":actionParser(_t_GLFL[_funcs[0]]["action"])
        };
        (Global_BasicPlayerData.RoundAllowActions as Array<any>).push(_t_o);
    }
}
const GetRoundEvent=():void=>{
    Global_BasicPlayerData.ThisRoundEvent=[];
    // console.log(1,GetEventTimes()+(Global_BasicPlayerData.RoundCounter==0?2:0));
    for(const j of GameEventList){
        if(conditionParser(j["condition"],undefined,undefined,true)["_direct_use_result_transer"])
            if(j["useVal"]){
                effectParser(j["effect"],j["useVal"],j["text"])();
            }else{
                effectParser(j["effect"],undefined,j["text"])();
            }
    }
    Global_BasicPlayerData.RoundCounter+=1;
}
GetActionList();
GetPlayerAccessable();
</script>
<style lang="scss" scoped>
$BaseMainColor:#1F242B;
$BaseSecondaryColor:#0046FF;
$BaseSecondaryColor2:#F91941;
$BaseSecondaryColor3:#00B1FF;
$BaseSecondaryColor4:#008b7b;
$FontColor:lighten($BaseMainColor,40%);
$FontActive:lighten($BaseMainColor,55%);
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
        }
    }
    .ActionBox{
        .ActionIntro{
            width: 100%;
            font-size: 22px;
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
