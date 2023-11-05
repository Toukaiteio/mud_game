<template>
    <div class="MainWrapper">
        <div class="RegisterCard">
            <div class="Wrapper Centralize" :class="{show:UserInputManager.InputIndex==0,prev:UserInputManager.getPrev()==0,next:UserInputManager.getNext()==0,backward:PageStateManager.isBackWard,forward:!PageStateManager.isBackWard,hide:isElementHide(0)}">
                <div class="InputerWrapper" :class="InputBarStatus['PlayerName']['InfoType']">
                    <input type="text" v-model="UserInputManager.PlayerName" class="GameInputer" :placeholder="$t('_gameinputer_playername')">
                    <div class="InfoContent" v-dompurify-html="InputBarStatus['PlayerName']['InfoContent']"></div>
                    <input type="text" v-model="UserInputManager.PlayerSaveName" class="GameInputer" :placeholder="$t('_gameinputer_playersavename')">
                    <div class="InfoContent" v-dompurify-html="InputBarStatus['PlayerSaveName']['InfoContent']"></div>
                    <div class="LoadSaveList" v-if="GameFileList['save'].length>0">
                        <div class="SaveFileItem" v-for="(_c,_i) in GameFileList['save']" :key="`${_i}-SaveFilelist`" @click="LoadGameFromSaveFile(_c)" @touchstart="StartDeleteAnimation(_i)" @touchend="CancelDeleteAnimation(_i)">
                            <div class="DeleteAnimationHolder" :class="{deleting:DeleteAnimationController['save'][_i]}"></div>
                            <div class="Context">
                                {{ `${_i}-${_c}` }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="Wrapper  HasSelector" :class="{show:UserInputManager.InputIndex==1,prev:UserInputManager.getPrev()==1,next:UserInputManager.getNext()==1,backward:PageStateManager.isBackWard,forward:!PageStateManager.isBackWard,hide:isElementHide(1)}">
                <div class="WelcomeMessage" v-dompurify-html='$t("_tab_create_character_HelloPage_Hello")'>
                </div>
                <div class="ChooseGender" v-dompurify-html='$t("_tab_create_character_HelloPage_ChooseGender")'>
                </div>
                <div class="GenderSelector">
                    <DysSelector @on-selected="OnGenderSelectedHandler" @on-canceled="OnGenderCanceledHandler" :max-allow-selection="1" :selector-props="PageComponentsManager.GenderSelectorList"></DysSelector>
                    <div class="WraningMessage" v-dompurify-html="PageStateManager.GenderSelectorWarningMessage"></div>
                </div>
            </div>
            <div class="Wrapper" :class="{show:UserInputManager.InputIndex==2,prev:UserInputManager.getPrev()==2,next:UserInputManager.getNext()==2,backward:PageStateManager.isBackWard,forward:!PageStateManager.isBackWard,hide:isElementHide(2)}">
                <div class="RangeBar">
                    <div class="RangeName" v-dompurify-html="$t('_general_ATK')"></div>
                    <div class="Bar"><DysRange :min-range="-4" :max-range="4" v-model:now-number="Global_BasicPlayerData.PlayerStatus.ATK"></DysRange></div>
                </div>
                <div class="RangeBar">
                    <div class="RangeName" v-dompurify-html="$t('_general_DEF')"></div>
                    <div class="Bar"><DysRange :min-range="-4" :max-range="4" v-model:now-number="Global_BasicPlayerData.PlayerStatus.DEF"></DysRange></div>
                </div>
                <div class="RangeBar">
                    <div class="RangeName" v-dompurify-html="$t('_general_MOV')"></div>
                    <div class="Bar"><DysRange :min-range="-4" :max-range="4" v-model:now-number="Global_BasicPlayerData.PlayerStatus.MOV"></DysRange></div>
                </div>
            </div>
            <div class="Wrapper HasSelector" :class="{show:UserInputManager.InputIndex==3,prev:UserInputManager.getPrev()==3,next:UserInputManager.getNext()==3,backward:PageStateManager.isBackWard,forward:!PageStateManager.isBackWard,hide:isElementHide(3)}">
                <div class="CommonCard">
                    <div class="DescribeFact">
                        <p v-dompurify-html="$t('_tab_choose_start_StartPage_Line1')"></p>
                        <p v-dompurify-html="$t('_tab_choose_start_StartPage_Line2')"></p>
                        <p v-dompurify-html="$t('_tab_choose_start_StartPage_Line3')"></p>
                        <p v-if="UserInputManager.PlayerBornIntro" v-dompurify-html="UserInputManager.PlayerBornIntro"></p>
                    </div>
                </div>
                <div class="CommonSelector">
                        <DysSelector @on-selected="OnBornSelectedHandler" @on-canceled="OnBornCanceledHandler" :max-allow-selection="1" :selector-props="PageComponentsManager.BornSelectorList"></DysSelector>
                        
                        <div class="WraningMessage" v-dompurify-html="PageStateManager.BornSelectorWarningMessage"></div>
                </div>
            </div>
            <div class="Btns">
                <div class="BWrapper" @click="GoPrevPage()" v-if="UserInputManager.InputIndex>0">
                    <div class="Roller"></div>
                    <div class="Arrow">&lt;</div>
                </div>
                <div class="BWrapper" @click="(UserInputManager.NextBtnFunc[UserInputManager.InputIndex] || DefalutNextFunc)()" :class="{CentralFix:UserInputManager.InputIndex==0,AlmostDone:UserInputManager.InputIndex==UserInputManager.InputTotalLayer}">
                    <div class="Roller"></div>
                    <div class="Arrow">></div>
                </div>
                
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { useGameMainStorage } from '@/utils/store';
import DysSelector from '@/components/DysSelector.vue';
import DysRange from '@/components/DysRange.vue';
import GenderList from '@/resources/game/born/GenderList.json';
import BornList from '@/resources/game/born/PlayerAllowBorn.json';
import { reactive} from 'vue';
import router from '@/router';
let GameFileList=reactive(JSON.parse(localStorage.getItem("GameSaveFiles") || '{"save":[]}') as Record<string,any>);
let DeleteAnimationController:Record<string,any>=reactive({"save":[]});
let DeleteAnimationTimeOut=-1;
for(const _ in GameFileList["save"]){
    DeleteAnimationController[_]=false;
}
// const popItemFromArray=(item:any,arr:Array<any>)=>{
//     return arr.slice(0,arr.indexOf(item)).concat(arr.slice(arr.indexOf(item)+1));
// }
const popItemByIndex=(index:number,arr:Array<any>)=>{
    return arr.slice(0,index).concat(arr.slice(index+1));
}
const StartDeleteAnimation=(index:number):void=>{
    DeleteAnimationTimeOut=setTimeout(()=>{
        DeleteAnimationController["save"][index]=true;
        DeleteAnimationTimeOut=setTimeout(()=>{
            DeleteAnimationController["save"]=popItemByIndex(index,DeleteAnimationController["save"]);
            localStorage.removeItem("_MUDGAMESAVEDATA_"+GameFileList["save"][index]);
            GameFileList["save"]=popItemByIndex(index,GameFileList["save"]);
            localStorage.setItem("GameSaveFiles",JSON.stringify(GameFileList));
            DeleteAnimationTimeOut=-1;
        },1400);
    },250)
}
const CancelDeleteAnimation=(index:number):void=>{
    if(DeleteAnimationController["save"][index]){
        clearTimeout(DeleteAnimationTimeOut);
        DeleteAnimationController["save"][index]=false;
        DeleteAnimationTimeOut=-1;
    }else if(DeleteAnimationTimeOut!=-1){
        clearTimeout(DeleteAnimationTimeOut);
        DeleteAnimationTimeOut=-1;
    }
}
const GameData=useGameMainStorage();
const { Global_BasicPlayerData,indexMap,MenuData,GameMap,GameNpc, $t,effectParser }=GameData;
const GenderListParser=(ori:Array<Record<string,any>>):Array<Record<string,any>>=>{
    const _result:Array<Record<string,any>>=[];
    for(const i in ori){
        const _t={
            text:ori[i].text,
            icon:ori[i].icon,
            value:i,
            callback:()=>{return;},
        }
        if(ori[i]["effect"]){
            _t.callback=effectParser(ori[i]["effect"]);
        }
        _result.push(_t);
    }
    return _result;
}
const BornListParser=(ori:Array<Record<string,any>>):Array<Record<string,any>>=>{
    const _result:Array<Record<string,any>>=[];
    for(const i in ori){
        const _t={
            text:ori[i].text,
            icon:ori[i].icon,
            value:i,
            callback:()=>{return;},
        }
        if(ori[i]["effect"]){
            _t.callback=effectParser(ori[i]["effect"]);
        }
        _result.push(_t);
    }
    return _result;
}
const PageComponentsManager=reactive({
    GenderSelectorList:GenderListParser(GenderList),
    BornSelectorList:BornListParser(BornList)
});
const DefalutNextFunc=():void=>{
    PageStateManager.isBackWard=false;
    UserInputManager.InputIndex=UserInputManager.getNext();
}
const SetPlayerNameFunc=():void=>{
    if(UserInputManager.PlayerName!='' && UserInputManager.PlayerName.length<=32){
        if(UserInputManager.PlayerSaveName!='' && UserInputManager.PlayerSaveName.length<=32){
            Global_BasicPlayerData.PlayerName=UserInputManager.PlayerName;
            Global_BasicPlayerData.PlayerSaveName=UserInputManager.PlayerSaveName;
            PageStateManager.isBackWard=false;
            UserInputManager.InputIndex=UserInputManager.getNext();
            ClearInputInfo("PlayerSaveName");
        }else ThrowPlayerSaveNameException(UserInputManager.PlayerSaveName);
        ClearInputInfo("PlayerName");
    }
    else ThrowPlayerNameException(UserInputManager.PlayerName);
}
const OnGenderSelectedHandler=(data:number):void=>{
    Global_BasicPlayerData.PlayerGender=data;
    if(data!=-1) Global_BasicPlayerData.PlayerGenderDisplay=$t(`_shortGenderSelection${data}`);
    else Global_BasicPlayerData.PlayerGenderDisplay=""
}
const OnBornSelectedHandler=(data:number):void=>{
    Global_BasicPlayerData.PlayerBorn=data;
    if(data!=-1) {Global_BasicPlayerData.PlayerBornDisplay=$t(`_tab_choose_start_StartPage_ChooseBorn${data}`);UserInputManager.PlayerBornIntro=$t(`_intro_Born${data}`);}
    else {Global_BasicPlayerData.PlayerGenderDisplay="";UserInputManager.PlayerBornIntro="";}
}
const OnBornCanceledHandler=(data:number):void=>{
    if(Global_BasicPlayerData.PlayerBorn==data){
        Global_BasicPlayerData.PlayerBorn=-1;
        Global_BasicPlayerData.PlayerBornDisplay="";
        UserInputManager.PlayerBornIntro="";
    }

}
const OnGenderCanceledHandler=(data:number):void=>{
    if(Global_BasicPlayerData.PlayerGender==data){
        Global_BasicPlayerData.PlayerGender=-1;
        Global_BasicPlayerData.PlayerGenderDisplay="";
    }
}
const SavePlayerGenderAction=():void=>{
    if(Global_BasicPlayerData.PlayerGender!=-1){
        DefalutNextFunc();
    }else{
        PageStateManager.GenderSelectorWarningMessage=$t("_tab_create_character_HelloPage_ChooseGender_Warning_Empty");
    }
}
const MapAndNPCLoader=(oriMapData:Record<string,any>):Record<string,any>=>{
    const _result=({} as Record<string,any>);
    for(const i in oriMapData){
        _result[i]={}
        for(const j in oriMapData[i]){
            if(j=="default"){
                for(const k in oriMapData[i][j]){
                    _result[i][k]=oriMapData[i][j][k];
                }
            }else{
                _result[i][j]=oriMapData[i][j];
            }
        }
    }
    return _result;
}
const LoadSave=(SaveFileName:string):Record<string,any>=>{
    return JSON.parse(localStorage.getItem('_MUDGAMESAVEDATA_'+SaveFileName) || "{}");
}
const LoadGameFromSaveFile=(SaveFileName:string):void=>{
    const _savedata=LoadSave(SaveFileName);
    for(const i in _savedata){
        (Global_BasicPlayerData as Record<string,any>)[i]=_savedata[i];
    }
    MenuData.MenuElement=[{
            _icon:"M304 128a80 80 0 1 0 -160 0 80 80 0 1 0 160 0zM96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM49.3 464H398.7c-8.9-63.3-63.3-112-129-112H178.3c-65.7 0-120.1 48.7-129 112zM0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3z",
            _text:"_tab_Main"
        },
        {
            _icon:"M304 128a80 80 0 1 0 -160 0 80 80 0 1 0 160 0zM96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM49.3 464H398.7c-8.9-63.3-63.3-112-129-112H178.3c-65.7 0-120.1 48.7-129 112zM0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3z",
            _text:"_tab_CheckSelfStatus"
        },
        {
            _icon:"M304 128a80 80 0 1 0 -160 0 80 80 0 1 0 160 0zM96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM49.3 464H398.7c-8.9-63.3-63.3-112-129-112H178.3c-65.7 0-120.1 48.7-129 112zM0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3z",
            _text:"_tab_Storage"
        },
        {
            _icon:"M304 128a80 80 0 1 0 -160 0 80 80 0 1 0 160 0zM96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM49.3 464H398.7c-8.9-63.3-63.3-112-129-112H178.3c-65.7 0-120.1 48.7-129 112zM0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3z",
            _text:"_tab_Equipment"
        }];
    for(const i of MenuData.MenuElement) (indexMap as Array<string>).push(i["_text"]);
    router.push("./main")
}
const FinalPlayerCreateAction=():void=>{
    //trigger
    if(Global_BasicPlayerData.PlayerBorn!=-1){
        PageComponentsManager.GenderSelectorList[Global_BasicPlayerData.PlayerGender].callback();
        Global_BasicPlayerData.PlayerLocate="10000";

        MenuData.MenuElement=[{
            _icon:"M304 128a80 80 0 1 0 -160 0 80 80 0 1 0 160 0zM96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM49.3 464H398.7c-8.9-63.3-63.3-112-129-112H178.3c-65.7 0-120.1 48.7-129 112zM0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3z",
            _text:"_tab_Main"
        },
        {
            _icon:"M304 128a80 80 0 1 0 -160 0 80 80 0 1 0 160 0zM96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM49.3 464H398.7c-8.9-63.3-63.3-112-129-112H178.3c-65.7 0-120.1 48.7-129 112zM0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3z",
            _text:"_tab_CheckSelfStatus"
        },
        {
            _icon:"M304 128a80 80 0 1 0 -160 0 80 80 0 1 0 160 0zM96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM49.3 464H398.7c-8.9-63.3-63.3-112-129-112H178.3c-65.7 0-120.1 48.7-129 112zM0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3z",
            _text:"_tab_Storage"
        },
        {
            _icon:"M304 128a80 80 0 1 0 -160 0 80 80 0 1 0 160 0zM96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM49.3 464H398.7c-8.9-63.3-63.3-112-129-112H178.3c-65.7 0-120.1 48.7-129 112zM0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3z",
            _text:"_tab_Equipment"
        }];
        for(const i of MenuData.MenuElement) (indexMap as Array<string>).push(i["_text"]);
        Global_BasicPlayerData["GameOnMap"]=MapAndNPCLoader(GameMap)!;
        Global_BasicPlayerData["GameOnNpcs"]=MapAndNPCLoader(GameNpc)!;
        Global_BasicPlayerData.PlayerLocateDisplay=$t((Global_BasicPlayerData.GameOnMap as Record<string,any>)[Global_BasicPlayerData.PlayerLocate]["name"]);
        localStorage.setItem('_MUDGAMESAVEDATA_'+Global_BasicPlayerData.PlayerSaveName,JSON.stringify(Global_BasicPlayerData));
        GameFileList["save"]!.push(Global_BasicPlayerData.PlayerSaveName);
        localStorage.setItem("GameSaveFiles",JSON.stringify(GameFileList));
        router.push("./main")
    }else{
        PageStateManager.BornSelectorWarningMessage=$t("_tab_choose_start_StartPage_ChooseBorn_Warning_Empty");
    }
}
const UserInputManager=reactive({
    InputIndex:0,
    InputTotalLayer:3,
    NextBtnFunc:[
        SetPlayerNameFunc,
        SavePlayerGenderAction,
        null,
        FinalPlayerCreateAction
    ],
    getPrev(){
        if(this.InputIndex<=0) return this.InputTotalLayer
        else return this.InputIndex-1;
    },
    getNext(){
        if(this.InputIndex>=this.InputTotalLayer) return 0;
        else return this.InputIndex+1;
    },
    PlayerName:"",
    PlayerSaveName:"",
    PlayerBornIntro:"",
});
const isElementHide=(index:number):boolean=>{
    return (UserInputManager.InputIndex!=index && UserInputManager.getNext()!=index && UserInputManager.getPrev()!=index)
}
interface InputBarBasicInfoContent{
    InfoType:"error"|"info"|"success"|"none";
    InfoContent:string
}
type InputAlert=InputBarBasicInfoContent;
const InputBarStatus:Record<string,InputAlert>=reactive({
    "PlayerName":{
        InfoType:"none",
        InfoContent:"",
    },
    "PlayerSaveName":{
        InfoType:"none",
        InfoContent:"",
    }

});
const PageStateManager=reactive({
    isBackWard:false,
    GenderSelectorWarningMessage:"",
    BornSelectorWarningMessage:""
})

const ClearInputInfo=(target:string):void=>{
    InputBarStatus[target]={
        InfoType:"none",
        InfoContent:""
    }
}
const ThrowInputInfo=(target:string,InfoType:"error"|"info"|"success"|"none",InfoContent:string):void=>{
    InputBarStatus[target]={
        InfoType:InfoType,
        InfoContent:InfoContent
    }
}
const ThrowPlayerNameException=(ori:string):void=>{
    if(ori.length>32) ThrowInputInfo("PlayerName","error",$t("_gameinputer_playername_Overlength"));
    if(ori.length==0) ThrowInputInfo("PlayerName","error",$t("_gameinputer_playername_Empty"));
}
const ThrowPlayerSaveNameException=(ori:string):void=>{
    if(ori.length>32) ThrowInputInfo("PlayerSaveName","error",$t("_gameinputer_playersavename_Overlength"));
    if(ori.length==0) ThrowInputInfo("PlayerSaveName","error",$t("_gameinputer_playersavename_Empty"));
}
const GoPrevPage=():void=>{
    PageStateManager.isBackWard=true;
    UserInputManager.InputIndex=UserInputManager.getPrev();
}
</script>
<style lang="scss" scoped>
$BaseMainColor:#1F242B;
$BaseSecondaryColor:#0046FF;
$BaseSecondaryColor2:#F91941;
$BaseSecondaryColor3:#00B1FF;
$BaseSecondaryColor4:#008b7b;
$FontColor:lighten($BaseMainColor,40%);
$FontActive:lighten($BaseMainColor,55%);
@keyframes roller {
    0%{
        transform: rotateZ(0deg);
    }
    100%{
        transform: rotateZ(360deg);
    }
}
@keyframes rtm {
    0%{
        transform: translateX(110%);
        display: none;
    }
    100%{
        transform: translateX(0%);
    }
}
@keyframes mtl {
    0%{
        transform: translateX(0%);
    }
    100%{
        transform: translateX(-110%);
        display: none;
    }
}
@keyframes ltm {
    0%{
        transform: translateX(-110%);
        display: none;
    }
    100%{
        transform: translateX(0%);
    }
}
@keyframes mtr {
    0%{
        transform: translateX(0%);
    }
    100%{
        transform: translateX(-110%);
        display: none;
    }
}

@keyframes spin {
  0% {
    --rotate: 0deg;
  }
  100% {
    --rotate: 360deg;
  }
}
@keyframes deleteAnimation {
    0%{
        width: 0%;
        background: mix($BaseMainColor,$BaseSecondaryColor);
    }
    100%{
        width: 100%;
        background: $BaseSecondaryColor2;
    }
}
    .MainWrapper{
        height: 100%;
        width: 100%;
        overflow: hidden;
        padding: 26px;
        .RegisterCard{
            width: 100%;
            height: 100%;
            .Wrapper{
                .LoadSaveList{
                    width: 100%;
                    height: 100%;
                    overflow-x: hidden;
                    overflow-y: scroll;
                    &::-webkit-scrollbar{
                        display: none;
                    }
                    .SaveFileItem{
                        width: 100%;
                        height: 46px;
                        position: relative;
                        .DeleteAnimationHolder{
                            position: absolute;
                            top: 0;
                            left: 0;
                            width: 0%;
                            height: 100%;
                            z-index: 10;
                            transition: background 0.6s;
                            &.deleting{
                                animation: deleteAnimation 1.4s linear forwards;
                            }
                        }
                        .Context{
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
                        background: mix($BaseMainColor,$BaseSecondaryColor);
                        &:active{
                            background: lighten($BaseSecondaryColor,10%);
                        }
                    }
                }
                position: absolute;
                top: 0;
                left: 0;
                overflow: hidden;
                text-overflow: ellipsis;
                .DescribeFact{
                    width: 100%;
                    padding: 6px;
                    border-radius: 6px;
                    overflow: hidden;
                    background-color: $BaseMainColor;
                    p{
                        width: 100%;
                    }
                }
                &.hide{
                    display: none !important;
                    opacity: 0;
                    pointer-events: none;
                    user-select: none;
                }
                &.prev.forward{
                    animation:mtl 0.6s forwards;
                }
                &.prev.backward{
                    animation:mtr 0.6s forwards;
                }
                &.show.forward{
                    animation:rtm 0.8s forwards;
                }
                &.show.backward{
                    animation:ltm 0.8s forwards;
                }
                &.next{
                    transform: translateX(110%);
                }
                width: 100%;
                height: 100%;
                &.Centralize{
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    position: absolute;
                }
                .WelcomeMessage{
                    font-size: 22px;
                    font-weight: bolder;
                }
                &.HasSelector{
                    display: flex;
                    flex-direction: column;
                }
                .GenderSelector,.CommonSelector{
                    
                    flex: 1;
                    height: 0;
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                }
                .RangeBar{
                    width: 100%;
                    height: 100px;
                    margin-bottom: 24px;
                    .RangeName{
                        height: 40px;
                        width: 100%;
                        font-size: 23px;
                        text-align: center;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        word-break: keep-all;
                        white-space: nowrap;
                    }
                    .Bar{
                        height: 60px;
                        width: 100%;
                        border-radius: 3px;
                        overflow: hidden;
                    }
                }
            }
            position: relative;
            padding-bottom: 42px;
            .Btns{
                user-select: none;
                position: absolute;
                left: 0px;
                bottom: 36px;
                height: 50px;
                padding-left: 36px;
                padding-right: 36px;
                width: 100%;
                display: flex;
                align-items: center;
                justify-content: space-evenly;
                .BWrapper{
                    height: 50px;
                    width: 50px;
                    position: relative;
                    &.CentralFix{
                        .Arrow{
                            margin-left: 2px;
                        }
                    }
                    &.AlmostDone{
                        .Roller{
                            border: 4px dashed $BaseSecondaryColor4 !important;
                        }
                    }
                }
                .Roller{
                    transition: background 0.6s;
                    overflow: hidden;
                    // &:hover{
                    //     background: darken($BaseMainColor,10%);
                    //     animation-play-state: paused;
                    // }
                    position: absolute;
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    border: 4px dashed $FontColor;
                    animation: roller 6s infinite linear;
                }
                
                .Arrow{
                    padding: 4px;
                    font-size: 35px;
                    height: 50px;
                    width: 50px;
                    font-family: Arial, Helvetica, sans-serif;
                    font-weight: bolder;
                    text-align: center;
                    line-height: 42px;
                    vertical-align: middle;
                    color:transparent;
                    -webkit-text-stroke: $FontColor 1px;
                }
                color: $FontColor;
                
            }
        }
    }
</style>